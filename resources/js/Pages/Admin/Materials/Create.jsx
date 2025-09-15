import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import MaterialForm from '@/Components/MaterialForm';

export default function Create({ suppliers }) {
    return (
        <AuthenticatedLayout
            header={
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">Novo Material</h2>
                    <p className="mt-1 text-sm text-gray-600">Adicione um novo material ao sistema</p>
                </div>
            }
        >
            <Head title="Novo Material" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <MaterialForm suppliers={suppliers} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}