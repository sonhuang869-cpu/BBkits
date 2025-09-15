import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function TestIndex() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Materials Test Page
                </h2>
            }
        >
            <Head title="Materials Test" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h1 className="text-3xl font-bold text-center mb-4">
                                🎉 Materials Page Works! 🎉
                            </h1>
                            <p className="text-center text-lg">
                                This is a simple test page to verify that the Materials navigation is working correctly.
                            </p>
                            <div className="mt-8 text-center">
                                <div className="inline-block bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                                    ✅ Navigation successful - No JavaScript errors!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}