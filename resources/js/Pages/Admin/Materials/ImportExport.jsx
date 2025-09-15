import { useState, useRef } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function ImportExport({ stats }) {
    const [importFile, setImportFile] = useState(null);
    const [importProgress, setImportProgress] = useState(null);
    const [importResults, setImportResults] = useState(null);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef(null);

    const [exportFilters, setExportFilters] = useState({
        category_id: '',
        supplier_id: '',
        active_only: false,
    });

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        setImportFile(file);
        setImportResults(null);
    };

    const handleImport = async () => {
        if (!importFile) {
            alert('Por favor, selecione um arquivo CSV');
            return;
        }

        setIsImporting(true);
        setImportProgress('Enviando arquivo...');

        const formData = new FormData();
        formData.append('file', importFile);

        try {
            const response = await fetch(route('admin.materials.import'), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                },
            });

            const data = await response.json();

            if (data.success) {
                setImportResults(data.results);
                setImportProgress('Importação concluída!');
                setImportFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            } else {
                setImportProgress('Erro na importação: ' + data.message);
            }
        } catch (error) {
            setImportProgress('Erro na importação: ' + error.message);
        } finally {
            setIsImporting(false);
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams(exportFilters);
        window.location.href = route('admin.materials.export') + '?' + params.toString();
    };

    const downloadTemplate = () => {
        window.location.href = route('admin.materials.export-template');
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Importar/Exportar Materiais</h2>
                        <p className="mt-1 text-sm text-gray-600">Gerencie materiais em massa através de arquivos CSV</p>
                    </div>
                </div>
            }
        >
            <Head title="Importar/Exportar Materiais" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total de Materiais</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total_materials}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-purple-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📁</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Categorias</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total_categories}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-green-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">🏢</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Fornecedores</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total_suppliers}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Export Section */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">📤 Exportar Materiais</h3>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                                    <select
                                        value={exportFilters.category_id}
                                        onChange={(e) => setExportFilters({...exportFilters, category_id: e.target.value})}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todas as categorias</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Fornecedor</label>
                                    <select
                                        value={exportFilters.supplier_id}
                                        onChange={(e) => setExportFilters({...exportFilters, supplier_id: e.target.value})}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todos os fornecedores</option>
                                    </select>
                                </div>
                                <div className="flex items-center pt-6">
                                    <input
                                        type="checkbox"
                                        id="active-only"
                                        checked={exportFilters.active_only}
                                        onChange={(e) => setExportFilters({...exportFilters, active_only: e.target.checked})}
                                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="active-only" className="ml-2 block text-sm text-gray-900">
                                        Apenas materiais ativos
                                    </label>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                <button
                                    onClick={handleExport}
                                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    Exportar CSV
                                </button>
                                <button
                                    onClick={downloadTemplate}
                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Baixar Template
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Import Section */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">📥 Importar Materiais</h3>
                        </div>
                        <div className="p-6">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Arquivo CSV
                                </label>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".csv,.txt"
                                    onChange={handleFileSelect}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                                />
                                <p className="mt-1 text-sm text-gray-500">
                                    Máximo 10MB. Use o template para garantir o formato correto.
                                </p>
                            </div>

                            {importFile && (
                                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center">
                                        <span className="text-blue-600 text-sm font-medium">
                                            📄 {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                                        </span>
                                    </div>
                                </div>
                            )}

                            {importProgress && (
                                <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
                                    <div className="text-yellow-800">{importProgress}</div>
                                </div>
                            )}

                            {importResults && (
                                <div className="mb-4 p-4 bg-green-50 rounded-lg">
                                    <h4 className="font-medium text-green-800 mb-2">Resultados da Importação</h4>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Total:</span> {importResults.total_rows}
                                        </div>
                                        <div>
                                            <span className="font-medium">Processados:</span> {importResults.processed}
                                        </div>
                                        <div>
                                            <span className="font-medium text-green-600">Criados:</span> {importResults.created}
                                        </div>
                                        <div>
                                            <span className="font-medium text-blue-600">Atualizados:</span> {importResults.updated}
                                        </div>
                                    </div>
                                    {importResults.errors.length > 0 && (
                                        <div className="mt-4">
                                            <h5 className="font-medium text-red-800 mb-2">Erros ({importResults.errors.length}):</h5>
                                            <ul className="text-sm text-red-700 space-y-1">
                                                {importResults.errors.slice(0, 10).map((error, index) => (
                                                    <li key={index}>• {error}</li>
                                                ))}
                                                {importResults.errors.length > 10 && (
                                                    <li>... e mais {importResults.errors.length - 10} erros</li>
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            <button
                                onClick={handleImport}
                                disabled={!importFile || isImporting}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isImporting ? 'Importando...' : 'Importar Arquivo'}
                            </button>
                        </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">📋 Instruções</h3>
                        </div>
                        <div className="p-6">
                            <div className="prose text-sm text-gray-600">
                                <h4 className="text-gray-900 font-medium mb-2">Formato do arquivo CSV:</h4>
                                <ul className="list-disc list-inside space-y-1 mb-4">
                                    <li>Use o template fornecido para garantir o formato correto</li>
                                    <li>Campos obrigatórios: reference, name, unit</li>
                                    <li>Use category_code para associar a uma categoria existente</li>
                                    <li>Use supplier_name para associar a um fornecedor existente</li>
                                    <li>Materiais existentes serão atualizados baseado na referência</li>
                                </ul>

                                <h4 className="text-gray-900 font-medium mb-2">Unidades válidas:</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div>
                                        <strong>Peso:</strong> g, kg, t
                                    </div>
                                    <div>
                                        <strong>Volume:</strong> ml, l, m³
                                    </div>
                                    <div>
                                        <strong>Comprimento:</strong> mm, cm, m, km
                                    </div>
                                    <div>
                                        <strong>Contagem:</strong> un, pç, par, dz, cx
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}