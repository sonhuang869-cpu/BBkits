import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import SupplierForm from '@/Components/SupplierForm';

export default function Edit({ supplier }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Editar Fornecedor</h2>
                    <p className="mt-1 text-sm text-gray-600">Atualize as informações do fornecedor {supplier.name}</p>
                </div>
            }
        >
            <Head title={`Editar Fornecedor - ${supplier.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <SupplierForm supplier={supplier} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}