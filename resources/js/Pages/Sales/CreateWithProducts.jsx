import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

export default function CreateWithProducts({ auth, clients = [], products = [] }) {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [embroideryOptions, setEmbroideryOptions] = useState({
        fonts: [],
        colors: [],
        positions: []
    });
    
    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        sale_type: 'product',
        total_amount: 0,
        notes: '',
        products: []
    });

    // Load embroidery options
    useEffect(() => {
        const loadEmbroideryOptions = async () => {
            try {
                const [fontsRes, colorsRes, positionsRes] = await Promise.all([
                    fetch('/api/embroidery/fonts'),
                    fetch('/api/embroidery/colors'),
                    fetch('/api/embroidery/positions')
                ]);
                
                setEmbroideryOptions({
                    fonts: await fontsRes.json(),
                    colors: await colorsRes.json(),
                    positions: await positionsRes.json()
                });
            } catch (error) {
                console.error('Error loading embroidery options:', error);
            }
        };

        loadEmbroideryOptions();
    }, []);

    const addProduct = () => {
        const newProduct = {
            id: Date.now(),
            product_id: '',
            quantity: 1,
            unit_price: 0,
            size: '',
            color: '',
            embroidery: {
                text: '',
                font_id: '',
                color_id: '',
                position: ''
            }
        };
        
        setSelectedProducts([...selectedProducts, newProduct]);
        updateFormData([...selectedProducts, newProduct]);
    };

    const removeProduct = (id) => {
        const updated = selectedProducts.filter(p => p.id !== id);
        setSelectedProducts(updated);
        updateFormData(updated);
    };

    const updateProduct = (id, field, value) => {
        const updated = selectedProducts.map(product => {
            if (product.id === id) {
                if (field.startsWith('embroidery.')) {
                    const embroideryField = field.replace('embroidery.', '');
                    return {
                        ...product,
                        embroidery: {
                            ...product.embroidery,
                            [embroideryField]: value
                        }
                    };
                } else {
                    return { ...product, [field]: value };
                }
            }
            return product;
        });
        
        setSelectedProducts(updated);
        updateFormData(updated);
    };

    const updateFormData = (productsData) => {
        const totalAmount = productsData.reduce((sum, product) => {
            return sum + (product.quantity * product.unit_price);
        }, 0);

        setData(prevData => ({
            ...prevData,
            products: productsData,
            total_amount: totalAmount
        }));
    };

    const getProductOptions = () => {
        return products.map(product => (
            <option key={product.id} value={product.id}>
                {product.name} - R$ {parseFloat(product.price).toFixed(2)}
            </option>
        ));
    };

    const getProductPrice = (productId) => {
        const product = products.find(p => p.id == productId);
        return product ? parseFloat(product.price) : 0;
    };

    const handleProductSelection = (id, productId) => {
        const price = getProductPrice(productId);
        updateProduct(id, 'product_id', productId);
        updateProduct(id, 'unit_price', price);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/admin/sales/with-products');
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Nova Venda - Com Produtos
                    </h2>
                </div>
            }
        >
            <Head title="Nova Venda - Com Produtos" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Client Selection */}
                            <div className="mb-6">
                                <InputLabel value="Cliente" />
                                <select
                                    value={data.client_id}
                                    onChange={(e) => setData('client_id', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                >
                                    <option value="">Selecione um cliente</option>
                                    {clients.map(client => (
                                        <option key={client.id} value={client.id}>
                                            {client.name} - {client.phone}
                                        </option>
                                    ))}
                                </select>
                                {errors.client_id && <div className="text-red-600 text-sm mt-1">{errors.client_id}</div>}
                            </div>

                            {/* Products Section */}
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium">Produtos</h3>
                                    <button
                                        type="button"
                                        onClick={addProduct}
                                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    >
                                        + Adicionar Produto
                                    </button>
                                </div>

                                {selectedProducts.map((product, index) => (
                                    <div key={product.id} className="border rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-medium">Produto #{index + 1}</h4>
                                            <button
                                                type="button"
                                                onClick={() => removeProduct(product.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Remover
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Product Selection */}
                                            <div>
                                                <InputLabel value="Produto" />
                                                <select
                                                    value={product.product_id}
                                                    onChange={(e) => handleProductSelection(product.id, e.target.value)}
                                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    required
                                                >
                                                    <option value="">Selecione um produto</option>
                                                    {getProductOptions()}
                                                </select>
                                            </div>

                                            {/* Quantity */}
                                            <div>
                                                <InputLabel value="Quantidade" />
                                                <TextInput
                                                    type="number"
                                                    min="1"
                                                    value={product.quantity}
                                                    onChange={(e) => updateProduct(product.id, 'quantity', parseInt(e.target.value) || 1)}
                                                    className="mt-1 block w-full"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            {/* Size */}
                                            <div>
                                                <InputLabel value="Tamanho" />
                                                <TextInput
                                                    value={product.size}
                                                    onChange={(e) => updateProduct(product.id, 'size', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    placeholder="P, M, G, GG..."
                                                />
                                            </div>

                                            {/* Color */}
                                            <div>
                                                <InputLabel value="Cor do Produto" />
                                                <TextInput
                                                    value={product.color}
                                                    onChange={(e) => updateProduct(product.id, 'color', e.target.value)}
                                                    className="mt-1 block w-full"
                                                    placeholder="Azul, Vermelho..."
                                                />
                                            </div>
                                        </div>

                                        {/* Embroidery Section */}
                                        <div className="border-t pt-4">
                                            <h5 className="font-medium mb-3">Bordado (opcional)</h5>
                                            
                                            <div className="grid grid-cols-2 gap-4 mb-3">
                                                {/* Embroidery Text */}
                                                <div>
                                                    <InputLabel value="Texto para Bordar" />
                                                    <TextInput
                                                        value={product.embroidery.text}
                                                        onChange={(e) => updateProduct(product.id, 'embroidery.text', e.target.value)}
                                                        className="mt-1 block w-full"
                                                        placeholder="Texto do bordado"
                                                    />
                                                </div>

                                                {/* Font */}
                                                <div>
                                                    <InputLabel value="Fonte" />
                                                    <select
                                                        value={product.embroidery.font_id}
                                                        onChange={(e) => updateProduct(product.id, 'embroidery.font_id', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        <option value="">Selecione uma fonte</option>
                                                        {embroideryOptions.fonts.map(font => (
                                                            <option key={font.id} value={font.id}>
                                                                {font.display_name} (+R$ {parseFloat(font.additional_cost).toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Embroidery Color */}
                                                <div>
                                                    <InputLabel value="Cor do Bordado" />
                                                    <select
                                                        value={product.embroidery.color_id}
                                                        onChange={(e) => updateProduct(product.id, 'embroidery.color_id', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        <option value="">Selecione uma cor</option>
                                                        {embroideryOptions.colors.map(color => (
                                                            <option key={color.id} value={color.id}>
                                                                {color.name} (+R$ {parseFloat(color.additional_cost).toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Position */}
                                                <div>
                                                    <InputLabel value="Posição" />
                                                    <select
                                                        value={product.embroidery.position}
                                                        onChange={(e) => updateProduct(product.id, 'embroidery.position', e.target.value)}
                                                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                                    >
                                                        <option value="">Selecione uma posição</option>
                                                        {embroideryOptions.positions.map(position => (
                                                            <option key={position.id} value={position.name}>
                                                                {position.display_name} (+R$ {parseFloat(position.additional_cost).toFixed(2)})
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Product Total */}
                                        <div className="mt-4 text-right">
                                            <span className="font-medium">
                                                Subtotal: R$ {(product.quantity * product.unit_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {selectedProducts.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        Nenhum produto adicionado. Clique em "Adicionar Produto" para começar.
                                    </div>
                                )}
                            </div>

                            {/* Notes */}
                            <div className="mb-6">
                                <InputLabel value="Observações" />
                                <textarea
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                                    rows="3"
                                    placeholder="Observações sobre a venda..."
                                />
                                {errors.notes && <div className="text-red-600 text-sm mt-1">{errors.notes}</div>}
                            </div>

                            {/* Total */}
                            <div className="mb-6 text-right">
                                <div className="text-2xl font-bold">
                                    Total: R$ {data.total_amount.toFixed(2)}
                                </div>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex justify-end space-x-2">
                                <SecondaryButton onClick={() => window.history.back()}>
                                    Cancelar
                                </SecondaryButton>
                                <PrimaryButton type="submit" disabled={processing || selectedProducts.length === 0}>
                                    Criar Venda
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}