import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from '@/Components/SupplierForm';

export default function Create() {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Novo Fornecedor</h2>
                    <p className="mt-1 text-sm text-gray-600">Adicione um novo fornecedor ao sistema</p>
                </div>
            }
        >
            <Head title="Novo Fornecedor" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <SupplierForm />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}