import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function CreateExpanded() {
    const { data, setData, post, processing, errors } = useForm({
        // Client info
        client_name: '',
        client_email: '',
        client_phone: '',
        client_cpf: '',
        
        // Child & embroidery
        child_name: '',
        embroidery_position: 'center',
        embroidery_color: 'pink',
        embroidery_font: 'cursive',
        
        // Payment
        total_amount: '',
        shipping_amount: '',
        payment_method: 'pix',
        received_amount: '',
        payment_date: '',
        payment_receipt: null,
        
        // Delivery address
        delivery_address: '',
        delivery_number: '',
        delivery_complement: '',
        delivery_neighborhood: '',
        delivery_city: '',
        delivery_state: '',
        delivery_zipcode: '',
        
        notes: ''
    });

    const [showPreview, setShowPreview] = useState(false);
    const [receiptPreview, setReceiptPreview] = useState(null);
    
    // Dynamic embroidery options from API
    const [embroideryFonts, setEmbroideryFonts] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);
    const [embroideryPositions, setEmbroideryPositions] = useState([]);
    const [loadingOptions, setLoadingOptions] = useState(true);
    const [totalWithEmbroidery, setTotalWithEmbroidery] = useState(0);

    // Fetch embroidery options from API on component mount
    useEffect(() => {
        const fetchEmbroideryOptions = async () => {
            try {
                setLoadingOptions(true);
                
                const [fontsRes, colorsRes, positionsRes] = await Promise.all([
                    axios.get('/api/embroidery/fonts'),
                    axios.get('/api/embroidery/colors'),
                    axios.get('/api/embroidery/positions')
                ]);
                
                setEmbroideryFonts(fontsRes.data);
                setEmbroideryColors(colorsRes.data);
                setEmbroideryPositions(positionsRes.data);
                
                // Set default values if available
                if (fontsRes.data.length > 0 && !data.embroidery_font) {
                    setData('embroidery_font', fontsRes.data[0].id);
                }
                if (colorsRes.data.length > 0 && !data.embroidery_color) {
                    setData('embroidery_color', colorsRes.data[0].id);
                }
                if (positionsRes.data.length > 0 && !data.embroidery_position) {
                    setData('embroidery_position', positionsRes.data[0].id);
                }
                
                setLoadingOptions(false);
            } catch (error) {
                console.error('Error fetching embroidery options:', error);
                toast.error('Erro ao carregar opções de bordado');
                setLoadingOptions(false);
            }
        };
        
        fetchEmbroideryOptions();
    }, []);
    
    // Calculate total with embroidery costs whenever options change
    useEffect(() => {
        const calculateTotal = () => {
            let embroideryCost = 0;
            
            // Find selected options and add their costs
            const selectedFont = embroideryFonts.find(f => f.id == data.embroidery_font);
            const selectedColor = embroideryColors.find(c => c.id == data.embroidery_color);
            const selectedPosition = embroideryPositions.find(p => p.id == data.embroidery_position);
            
            if (selectedFont) embroideryCost += parseFloat(selectedFont.additional_cost || 0);
            if (selectedColor) embroideryCost += parseFloat(selectedColor.additional_cost || 0);
            if (selectedPosition) embroideryCost += parseFloat(selectedPosition.additional_cost || 0);
            
            const baseAmount = parseFloat(data.total_amount || 0);
            setTotalWithEmbroidery(baseAmount + embroideryCost);
        };
        
        calculateTotal();
    }, [data.embroidery_font, data.embroidery_color, data.embroidery_position, data.total_amount, embroideryFonts, embroideryColors, embroideryPositions]);

    const handleReceiptChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('payment_receipt', file);
            
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setReceiptPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const requiredFields = [
            'client_name', 'client_email', 'client_phone',
            'child_name', 'total_amount', 'shipping_amount',
            'received_amount', 'payment_date', 'payment_method',
            'delivery_address', 'delivery_number', 'delivery_neighborhood',
            'delivery_city', 'delivery_state', 'delivery_zipcode'
        ];

        const missingFields = requiredFields.filter(field => !data[field]);
        
        if (missingFields.length > 0) {
            toast.error('Por favor, preencha todos os campos obrigatórios');
            return false;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.client_email)) {
            toast.error('Por favor, insira um e-mail válido');
            return false;
        }

        // Validate phone
        const phoneRegex = /^\d{10,11}$/;
        const cleanPhone = data.client_phone.replace(/\D/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            toast.error('Por favor, insira um telefone válido');
            return false;
        }

        // Validate CPF
        const cpfRegex = /^\d{11}$/;
        const cleanCPF = data.client_cpf.replace(/\D/g, '');
        if (data.client_cpf && !cpfRegex.test(cleanCPF)) {
            toast.error('Por favor, insira um CPF válido');
            return false;
        }

        // Validate amounts
        if (parseFloat(data.received_amount) > parseFloat(data.total_amount)) {
            toast.error('Valor recebido não pode ser maior que o valor total');
            return false;
        }

        return true;
    };

    const submit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        post(route('sales.store'), {
            onSuccess: () => {
                toast.success('Venda registrada com sucesso! Cliente receberá o link personalizado. 🎉');
            },
            onError: (errors) => {
                Object.keys(errors).forEach(key => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    const formatPhone = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
        if (match) {
            return `(${match[1]}) ${match[2]}-${match[3]}`;
        }
        const match2 = cleaned.match(/^(\d{2})(\d{4})(\d{4})$/);
        if (match2) {
            return `(${match2[1]}) ${match2[2]}-${match2[3]}`;
        }
        return value;
    };

    const formatCPF = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/);
        if (match) {
            return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`;
        }
        return value;
    };

    const formatCEP = (value) => {
        const cleaned = value.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{5})(\d{3})$/);
        if (match) {
            return `${match[1]}-${match[2]}`;
        }
        return value;
    };

    // Removed hardcoded options - now fetched from API

    const paymentMethods = {
        pix: 'PIX',
        boleto: 'Boleto',
        cartao: 'Cartão',
        dinheiro: 'Dinheiro'
    };

    const states = [
        'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
        'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
        'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
    ];

    return (
        <>
            <Head title="Registrar Venda Completa" />

            <AuthenticatedLayout
                header={
                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold">
                            ✨ Novo Pedido BBKits
                        </h2>
                        <p className="text-purple-100 mt-1">
                            Preencha todos os dados do pedido para gerar o link personalizado da cliente
                        </p>
                    </div>
                }
            >
                <div className="py-12 bg-gray-50 min-h-screen">
                    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Cliente Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                                        👤
                                    </span>
                                    Dados da Cliente
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome Completo *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.client_name}
                                            onChange={e => setData('client_name', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Maria Silva"
                                            required
                                        />
                                        {errors.client_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            E-mail *
                                        </label>
                                        <input
                                            type="email"
                                            value={data.client_email}
                                            onChange={e => setData('client_email', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="maria@email.com"
                                            required
                                        />
                                        {errors.client_email && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Telefone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={data.client_phone}
                                            onChange={e => setData('client_phone', formatPhone(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="(11) 98765-4321"
                                            required
                                        />
                                        {errors.client_phone && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CPF
                                        </label>
                                        <input
                                            type="text"
                                            value={data.client_cpf}
                                            onChange={e => setData('client_cpf', formatCPF(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="123.456.789-00"
                                        />
                                        {errors.client_cpf && (
                                            <p className="text-red-500 text-sm mt-1">{errors.client_cpf}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Bordado Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-pink-100 text-pink-600 rounded-lg flex items-center justify-center">
                                        🎨
                                    </span>
                                    Personalização do Bordado
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Nome da Criança *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.child_name}
                                            onChange={e => setData('child_name', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Helena"
                                            required
                                        />
                                        {errors.child_name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.child_name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Posição do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_position}
                                            onChange={e => setData('embroidery_position', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryPositions.map((position) => (
                                                    <option key={position.id} value={position.id}>
                                                        {position.display_name || position.name}
                                                        {position.additional_cost > 0 && ` (+R$ ${parseFloat(position.additional_cost).toFixed(2)})`}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cor do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_color}
                                            onChange={e => setData('embroidery_color', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryColors.map((color) => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                        {color.additional_cost > 0 && ` (+R$ ${parseFloat(color.additional_cost).toFixed(2)})`}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Fonte do Bordado
                                        </label>
                                        <select
                                            value={data.embroidery_font}
                                            onChange={e => setData('embroidery_font', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            disabled={loadingOptions}
                                        >
                                            {loadingOptions ? (
                                                <option>Carregando...</option>
                                            ) : (
                                                embroideryFonts.map((font) => (
                                                    <option key={font.id} value={font.id}>
                                                        {font.display_name || font.name}
                                                        {font.additional_cost > 0 && ` (+R$ ${parseFloat(font.additional_cost).toFixed(2)})`}
                                                    </option>
                                                ))
                                            )}
                                        </select>
                                    </div>
                                </div>

                                {/* Preview do bordado */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Prévia:</p>
                                    <div className="text-center p-4 bg-white rounded border-2 border-dashed border-gray-300">
                                        <p 
                                            className="text-2xl font-serif"
                                            style={{ 
                                                color: embroideryColors.find(c => c.id == data.embroidery_color)?.hex_code || '#000000'
                                            }}
                                        >
                                            {data.child_name || 'Nome da Criança'}
                                        </p>
                                        <div className="text-xs text-gray-500 mt-2 space-y-1">
                                            <p>Posição: {embroideryPositions.find(p => p.id == data.embroidery_position)?.display_name || 'Não selecionado'}</p>
                                            <p>Fonte: {embroideryFonts.find(f => f.id == data.embroidery_font)?.display_name || 'Não selecionado'}</p>
                                            <p>Cor: {embroideryColors.find(c => c.id == data.embroidery_color)?.name || 'Não selecionado'}</p>
                                        </div>
                                    </div>
                                    
                                    {/* Show total with embroidery cost */}
                                    <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-medium text-purple-700">Custo adicional do bordado:</span>
                                            <span className="text-sm font-bold text-purple-900">
                                                R$ {(totalWithEmbroidery - parseFloat(data.total_amount || 0)).toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2 pt-2 border-t border-purple-200">
                                            <span className="font-medium text-purple-700">Total com bordado:</span>
                                            <span className="text-lg font-bold text-purple-900">
                                                R$ {totalWithEmbroidery.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Pagamento Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                                        💰
                                    </span>
                                    Informações de Pagamento
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Total *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.total_amount}
                                            onChange={e => setData('total_amount', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="299.90"
                                            required
                                        />
                                        {errors.total_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.total_amount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor do Frete *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.shipping_amount}
                                            onChange={e => setData('shipping_amount', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="25.00"
                                            required
                                        />
                                        {errors.shipping_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.shipping_amount}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Forma de Pagamento *
                                        </label>
                                        <select
                                            value={data.payment_method}
                                            onChange={e => setData('payment_method', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        >
                                            {Object.entries(paymentMethods).map(([value, label]) => (
                                                <option key={value} value={value}>{label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Valor Recebido *
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={data.received_amount}
                                            onChange={e => setData('received_amount', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="150.00"
                                            required
                                        />
                                        {errors.received_amount && (
                                            <p className="text-red-500 text-sm mt-1">{errors.received_amount}</p>
                                        )}
                                        {data.received_amount && data.total_amount && (
                                            <p className="text-sm text-gray-600 mt-1">
                                                {parseFloat(data.received_amount) < parseFloat(data.total_amount) ? (
                                                    <span className="text-orange-600">
                                                        ⚠️ Pagamento parcial - Restante: R$ {(parseFloat(data.total_amount) - parseFloat(data.received_amount)).toFixed(2)}
                                                    </span>
                                                ) : (
                                                    <span className="text-green-600">
                                                        ✅ Pagamento completo
                                                    </span>
                                                )}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Data do Pagamento *
                                        </label>
                                        <input
                                            type="date"
                                            value={data.payment_date}
                                            onChange={e => setData('payment_date', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        />
                                        {errors.payment_date && (
                                            <p className="text-red-500 text-sm mt-1">{errors.payment_date}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Comprovante de Pagamento
                                        </label>
                                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-purple-400 transition-colors">
                                            <div className="space-y-1 text-center">
                                                {receiptPreview ? (
                                                    <div>
                                                        <img 
                                                            src={receiptPreview} 
                                                            alt="Preview" 
                                                            className="mx-auto h-32 w-auto rounded"
                                                        />
                                                        <p className="text-sm text-gray-600 mt-2">
                                                            {data.payment_receipt?.name}
                                                        </p>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                        </svg>
                                                        <div className="flex text-sm text-gray-600">
                                                            <label htmlFor="payment_receipt" className="relative cursor-pointer rounded-md bg-white font-medium text-purple-600 hover:text-purple-500">
                                                                <span>Enviar arquivo</span>
                                                                <input
                                                                    id="payment_receipt"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    accept="image/*,application/pdf"
                                                                    onChange={handleReceiptChange}
                                                                />
                                                            </label>
                                                            <p className="pl-1">ou arraste aqui</p>
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            PNG, JPG, PDF até 2MB
                                                        </p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        {errors.payment_receipt && (
                                            <p className="text-red-500 text-sm mt-1">{errors.payment_receipt}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Entrega Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                                        📦
                                    </span>
                                    Endereço de Entrega
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Endereço *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_address}
                                            onChange={e => setData('delivery_address', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Rua das Flores"
                                            required
                                        />
                                        {errors.delivery_address && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_address}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Número *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_number}
                                            onChange={e => setData('delivery_number', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="123"
                                            required
                                        />
                                        {errors.delivery_number && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_number}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Complemento
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_complement}
                                            onChange={e => setData('delivery_complement', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Apto 12B"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Bairro *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_neighborhood}
                                            onChange={e => setData('delivery_neighborhood', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="Jardim Primavera"
                                            required
                                        />
                                        {errors.delivery_neighborhood && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_neighborhood}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Cidade *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_city}
                                            onChange={e => setData('delivery_city', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="São Paulo"
                                            required
                                        />
                                        {errors.delivery_city && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Estado *
                                        </label>
                                        <select
                                            value={data.delivery_state}
                                            onChange={e => setData('delivery_state', e.target.value)}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            required
                                        >
                                            <option value="">Selecione...</option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                        {errors.delivery_state && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_state}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            CEP *
                                        </label>
                                        <input
                                            type="text"
                                            value={data.delivery_zipcode}
                                            onChange={e => setData('delivery_zipcode', formatCEP(e.target.value))}
                                            className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                            placeholder="01234-567"
                                            required
                                        />
                                        {errors.delivery_zipcode && (
                                            <p className="text-red-500 text-sm mt-1">{errors.delivery_zipcode}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Observações Section */}
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-lg flex items-center justify-center">
                                        📝
                                    </span>
                                    Observações
                                </h3>
                                
                                <textarea
                                    value={data.notes}
                                    onChange={e => setData('notes', e.target.value)}
                                    rows={4}
                                    className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    placeholder="Informações adicionais sobre o pedido..."
                                />
                            </div>

                            {/* Preview Button */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    className="w-full text-orange-700 font-medium flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {showPreview ? 'Ocultar' : 'Visualizar'} Resumo do Pedido
                                </button>
                            </div>

                            {/* Preview Section */}
                            {showPreview && (
                                <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                                    <h4 className="font-semibold text-purple-900 mb-4">Resumo do Pedido:</h4>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>Cliente:</strong> {data.client_name} ({data.client_email})</p>
                                        <p><strong>Telefone:</strong> {data.client_phone}</p>
                                        <p><strong>Criança:</strong> {data.child_name}</p>
                                        <p><strong>Bordado:</strong> 
                                            {embroideryColors.find(c => c.id == data.embroidery_color)?.name}, 
                                            {embroideryFonts.find(f => f.id == data.embroidery_font)?.display_name}, 
                                            {embroideryPositions.find(p => p.id == data.embroidery_position)?.display_name}
                                        </p>
                                        <p><strong>Valor Total:</strong> R$ {parseFloat(data.total_amount || 0).toFixed(2)}</p>
                                        <p><strong>Valor Recebido:</strong> R$ {parseFloat(data.received_amount || 0).toFixed(2)}</p>
                                        <p><strong>Forma de Pagamento:</strong> {paymentMethods[data.payment_method]}</p>
                                        <p><strong>Entrega:</strong> {data.delivery_address}, {data.delivery_number} - {data.delivery_city}/{data.delivery_state}</p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-end">
                                <a
                                    href={route('sales.index')}
                                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-center"
                                >
                                    Cancelar
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {processing ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Processando...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Registrar Pedido
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </AuthenticatedLayout>
        </>
    );
}