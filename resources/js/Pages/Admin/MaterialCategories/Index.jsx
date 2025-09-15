import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ categories, rootCategories, filters, stats }) {
    const [search, setSearch] = useState(filters.search || '');
    const [parentId, setParentId] = useState(filters.parent_id || '');
    const [active, setActive] = useState(filters.active || '');

    const handleFilter = (e) => {
        e.preventDefault();
        router.get(route('admin.material-categories.index'), {
            search,
            parent_id: parentId,
            active,
        }, { preserveState: true });
    };

    const clearFilters = () => {
        setSearch('');
        setParentId('');
        setActive('');
        router.get(route('admin.material-categories.index'));
    };

    const handleDelete = (category) => {
        if (confirm(`Tem certeza que deseja excluir a categoria "${category.name}"?`)) {
            router.delete(route('admin.material-categories.destroy', category.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Categorias de Materiais</h2>
                        <p className="mt-1 text-sm text-gray-600">Gerencie as categorias para organizar seus materiais</p>
                    </div>
                    <Link
                        href={route('admin.material-categories.create')}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Nova Categoria
                    </Link>
                </div>
            }
        >
            <Head title="Categorias de Materiais" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border border-blue-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📁</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.total}</dd>
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
                                            <span className="text-white text-sm font-medium">✅</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Ativas</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.active}</dd>
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
                                            <span className="text-white text-sm font-medium">🏷️</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Principais</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.root}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border border-orange-200">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                            <span className="text-white text-sm font-medium">📦</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Com Materiais</dt>
                                            <dd className="text-lg font-medium text-gray-900">{stats.with_materials}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white shadow rounded-lg">
                        <form onSubmit={handleFilter} className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Buscar</label>
                                    <input
                                        type="text"
                                        placeholder="Nome, código ou descrição..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoria Pai</label>
                                    <select
                                        value={parentId}
                                        onChange={(e) => setParentId(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todas as categorias</option>
                                        <option value="root">Apenas principais</option>
                                        {rootCategories.map(category => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={active}
                                        onChange={(e) => setActive(e.target.value)}
                                        className="w-full rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                    >
                                        <option value="">Todas</option>
                                        <option value="1">Ativas</option>
                                        <option value="0">Inativas</option>
                                    </select>
                                </div>
                                <div className="flex items-end space-x-2">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                                    >
                                        Filtrar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Limpar
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Categories List */}
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                        {categories.data.length > 0 ? (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Código
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Categoria Pai
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Materiais
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ações
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {categories.data.map((category) => (
                                        <tr key={category.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <div
                                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm"
                                                            style={{ backgroundColor: category.color }}
                                                        >
                                                            {category.icon || '📁'}
                                                        </div>
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                                                        {category.description && (
                                                            <div className="text-sm text-gray-500">{category.description}</div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900 font-mono">{category.code}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {category.parent ? category.parent.name : '-'}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {category.materials_count}
                                                    {category.children.length > 0 && (
                                                        <span className="text-gray-500"> (+{category.children.length} sub)</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    category.active
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {category.active ? 'Ativa' : 'Inativa'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <Link
                                                    href={route('admin.material-categories.show', category.id)}
                                                    className="text-purple-600 hover:text-purple-900 mr-3"
                                                >
                                                    Ver
                                                </Link>
                                                <Link
                                                    href={route('admin.material-categories.edit', category.id)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                                                >
                                                    Editar
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="text-red-600 hover:text-red-900"
                                                    disabled={category.materials_count > 0 || category.children.length > 0}
                                                >
                                                    Excluir
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <div className="text-center py-12">
                                <span className="text-gray-400 text-6xl">📁</span>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Nenhuma categoria encontrada</h3>
                                <p className="mt-2 text-gray-500">Comece criando sua primeira categoria de material.</p>
                                <div className="mt-6">
                                    <Link
                                        href={route('admin.material-categories.create')}
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700"
                                    >
                                        Nova Categoria
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Pagination */}
                        {categories.links && (
                            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-700">
                                        Mostrando {categories.from} a {categories.to} de {categories.total} resultados
                                    </div>
                                    <div className="flex space-x-1">
                                        {categories.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url}
                                                className={`px-3 py-2 text-sm ${
                                                    link.active
                                                        ? 'bg-purple-500 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-50'
                                                } border border-gray-300 rounded`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}