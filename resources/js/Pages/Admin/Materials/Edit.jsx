import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MaterialForm from '@/Components/MaterialForm';

export default function Edit({ material, suppliers }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Editar Material</h2>
                    <p className="mt-1 text-sm text-gray-600">Atualize as informações do material {material.name}</p>
                </div>
            }
        >
            <Head title={`Editar Material - ${material.name}`} />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <MaterialForm material={material} suppliers={suppliers} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}