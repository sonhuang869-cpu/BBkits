import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ auth, designs, categories, filters }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Gerenciar Designs de Bordado (Simplified)
                    </h2>
                    <Link
                        href="/admin/embroidery"
                        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Voltar ao Dashboard
                    </Link>
                </div>
            }
        >
            <Head title="Gerenciar Designs de Bordado" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-semibold mb-4">Designs de Bordado</h3>
                            
                            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded">
                                <p><strong>Designs encontrados:</strong> {designs && designs.data ? designs.data.length : 0}</p>
                                <p><strong>Categorias disponíveis:</strong> {categories ? categories.length : 0}</p>
                                <p><strong>Status:</strong> Página simplificada funcionando!</p>
                            </div>

                            {designs && designs.data && designs.data.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {designs.data.map((design) => (
                                        <div key={design.id} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-semibold text-lg text-gray-800">{design.name}</h4>
                                            <p className="text-gray-600">ID: {design.id}</p>
                                            <p className="text-gray-600">
                                                Status: {design.is_active ? 'Ativo' : 'Inativo'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Nenhum design encontrado.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}