import { useState } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ permissionMatrix, roleDefinitions, permissionDescriptions }) {
    const { auth } = usePage().props;
    const [selectedRole, setSelectedRole] = useState('');

    const getPermissionIcon = (hasPermission) => {
        return hasPermission ? '✅' : '❌';
    };

    const getPermissionBadge = (hasPermission) => {
        return hasPermission
            ? 'bg-green-100 text-green-800'
            : 'bg-red-100 text-red-800';
    };

    const handleRoleChange = (e) => {
        const role = e.target.value;
        setSelectedRole(role);

        if (role) {
            fetch(route('admin.permissions.role', role))
                .then(response => response.json())
                .then(data => {
                    console.log('Role permissions:', data);
                });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Gerenciamento de Permissões</h2>
                        <p className="mt-1 text-sm text-gray-600">Visualizar e gerenciar permissões de usuários por função</p>
                    </div>
                </div>
            }
        >
            <Head title="Gerenciamento de Permissões" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    {/* Role Definitions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Definições de Funções</h3>
                            <p className="mt-1 text-sm text-gray-600">Descrição das funções disponíveis no sistema</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                                    <div key={roleKey} className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900">{role.name}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                                        <div className="mt-3 space-y-2">
                                            <div>
                                                <span className="text-xs font-medium text-gray-700">Materiais:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {role.materials.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-700">Fornecedores:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {role.suppliers.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-xs font-medium text-gray-700">Inventário:</span>
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                    {role.inventory.map(permission => (
                                                        <span key={permission} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                                            {permission}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Permission Descriptions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Descrição das Permissões</h3>
                            <p className="mt-1 text-sm text-gray-600">O que cada permissão permite fazer no sistema</p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {Object.entries(permissionDescriptions).map(([category, permissions]) => (
                                    <div key={category} className="space-y-3">
                                        <h4 className="font-medium text-gray-900 capitalize">{category}</h4>
                                        <div className="space-y-2">
                                            {Object.entries(permissions).map(([permission, description]) => (
                                                <div key={permission} className="border-l-4 border-blue-200 pl-3">
                                                    <div className="text-sm font-medium text-gray-700">{permission}</div>
                                                    <div className="text-xs text-gray-500">{description}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* User Permission Matrix */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Matriz de Permissões por Usuário</h3>
                            <p className="mt-1 text-sm text-gray-600">Visualização das permissões de cada usuário no sistema</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Usuário
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Função
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="4">
                                            Materiais
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="4">
                                            Fornecedores
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" colSpan="5">
                                            Inventário
                                        </th>
                                    </tr>
                                    <tr className="bg-gray-50">
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Ver</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Editar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Gerenciar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Deletar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Ver</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Editar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Gerenciar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Deletar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Ver</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Criar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Ajustar</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Lote</th>
                                        <th className="px-2 py-2 text-xs font-medium text-gray-500">Gerenciar</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {permissionMatrix.map((userMatrix) => (
                                        <tr key={userMatrix.user.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">{userMatrix.user.name}</div>
                                                    <div className="text-sm text-gray-500">{userMatrix.user.email}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                    {roleDefinitions[userMatrix.user.role]?.name || userMatrix.user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    userMatrix.user.approved ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {userMatrix.user.approved ? 'Aprovado' : 'Pendente'}
                                                </span>
                                            </td>

                                            {/* Materials permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.view)}`}>
                                                    {getPermissionIcon(userMatrix.materials.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.edit)}`}>
                                                    {getPermissionIcon(userMatrix.materials.edit)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.manage)}`}>
                                                    {getPermissionIcon(userMatrix.materials.manage)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.materials.delete)}`}>
                                                    {getPermissionIcon(userMatrix.materials.delete)}
                                                </span>
                                            </td>

                                            {/* Suppliers permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.view)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.edit)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.edit)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.manage)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.manage)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.suppliers.delete)}`}>
                                                    {getPermissionIcon(userMatrix.suppliers.delete)}
                                                </span>
                                            </td>

                                            {/* Inventory permissions */}
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.view)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.view)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.create)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.create)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.adjust)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.adjust)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.bulk)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.bulk)}
                                                </span>
                                            </td>
                                            <td className="px-2 py-4 text-center">
                                                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${getPermissionBadge(userMatrix.inventory.manage)}`}>
                                                    {getPermissionIcon(userMatrix.inventory.manage)}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Role Permission Simulator */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Simulador de Permissões por Função</h3>
                            <p className="mt-1 text-sm text-gray-600">Visualize as permissões de uma função específica</p>
                        </div>
                        <div className="p-6">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Selecionar Função</label>
                                <select
                                    value={selectedRole}
                                    onChange={handleRoleChange}
                                    className="w-full md:w-1/3 rounded-lg border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                >
                                    <option value="">Selecione uma função...</option>
                                    {Object.entries(roleDefinitions).map(([roleKey, role]) => (
                                        <option key={roleKey} value={roleKey}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedRole && roleDefinitions[selectedRole] && (
                                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Materiais</h4>
                                        <div className="space-y-2">
                                            {Object.entries(permissionDescriptions.materials).map(([permission, description]) => {
                                                const hasPermission = roleDefinitions[selectedRole].materials.includes(permission);
                                                return (
                                                    <div key={permission} className={`flex items-center p-2 rounded ${hasPermission ? 'bg-green-50' : 'bg-red-50'}`}>
                                                        <span className="mr-2">{getPermissionIcon(hasPermission)}</span>
                                                        <div>
                                                            <div className="text-sm font-medium">{permission}</div>
                                                            <div className="text-xs text-gray-500">{description}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Fornecedores</h4>
                                        <div className="space-y-2">
                                            {Object.entries(permissionDescriptions.suppliers).map(([permission, description]) => {
                                                const hasPermission = roleDefinitions[selectedRole].suppliers.includes(permission);
                                                return (
                                                    <div key={permission} className={`flex items-center p-2 rounded ${hasPermission ? 'bg-green-50' : 'bg-red-50'}`}>
                                                        <span className="mr-2">{getPermissionIcon(hasPermission)}</span>
                                                        <div>
                                                            <div className="text-sm font-medium">{permission}</div>
                                                            <div className="text-xs text-gray-500">{description}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h4 className="font-medium text-gray-900 mb-3">Inventário</h4>
                                        <div className="space-y-2">
                                            {Object.entries(permissionDescriptions.inventory).map(([permission, description]) => {
                                                const hasPermission = roleDefinitions[selectedRole].inventory.includes(permission);
                                                return (
                                                    <div key={permission} className={`flex items-center p-2 rounded ${hasPermission ? 'bg-green-50' : 'bg-red-50'}`}>
                                                        <span className="mr-2">{getPermissionIcon(hasPermission)}</span>
                                                        <div>
                                                            <div className="text-sm font-medium">{permission}</div>
                                                            <div className="text-xs text-gray-500">{description}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}