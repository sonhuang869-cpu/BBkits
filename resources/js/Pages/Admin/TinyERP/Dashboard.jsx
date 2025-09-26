import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function TinyERPDashboard({
    auth,
    stats,
    recentActivity,
    syncStatus,
    connectionStatus
}) {
    const [testingConnection, setTestingConnection] = useState(false);
    const [syncing, setSyncing] = useState(false);

    const testConnectionForm = useForm({});
    const bulkSyncForm = useForm({});

    const testConnection = () => {
        setTestingConnection(true);
        testConnectionForm.post('/admin/tiny-erp/test-connection', {
            onSuccess: () => {
                setTestingConnection(false);
            },
            onError: () => {
                setTestingConnection(false);
            }
        });
    };

    const bulkSync = () => {
        setSyncing(true);
        bulkSyncForm.post('/admin/tiny-erp/bulk-sync', {
            onSuccess: () => {
                setSyncing(false);
            },
            onError: () => {
                setSyncing(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Tiny ERP Integration
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={testConnection}
                            disabled={testingConnection}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {testingConnection ? 'Testing...' : 'Test Connection'}
                        </button>
                        <button
                            onClick={bulkSync}
                            disabled={syncing}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {syncing ? 'Syncing...' : 'Bulk Sync'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Tiny ERP Integration" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Connection Status */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Connection Status</h3>
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${connectionStatus?.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                <span className={`font-medium ${connectionStatus?.connected ? 'text-green-700' : 'text-red-700'}`}>
                                    {connectionStatus?.connected ? 'Connected' : 'Disconnected'}
                                </span>
                                {connectionStatus?.lastChecked && (
                                    <span className="text-sm text-gray-500">
                                        Last checked: {new Date(connectionStatus.lastChecked).toLocaleString()}
                                    </span>
                                )}
                            </div>
                            {connectionStatus?.error && (
                                <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                    {connectionStatus.error}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-blue-600">{stats?.totalInvoices || 0}</div>
                                <div className="text-sm text-gray-600">Total Invoices</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-green-600">{stats?.syncedOrders || 0}</div>
                                <div className="text-sm text-gray-600">Synced Orders</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-orange-600">{stats?.pendingInvoices || 0}</div>
                                <div className="text-sm text-gray-600">Pending Invoices</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-purple-600">{stats?.shippingLabels || 0}</div>
                                <div className="text-sm text-gray-600">Shipping Labels</div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                            {recentActivity && recentActivity.length > 0 ? (
                                <div className="space-y-3">
                                    {recentActivity.map((activity, index) => (
                                        <div key={activity.id || index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">{activity.description}</div>
                                                <div className="text-xs text-gray-500">
                                                    {activity.type} - {new Date(activity.created_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent activity</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by syncing your first order.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sync Status */}
                    {syncStatus && (
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Sync Status</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Last Sync:</span>
                                        <span className="text-sm font-medium">
                                            {syncStatus.lastSync ? new Date(syncStatus.lastSync).toLocaleString() : 'Never'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-600">Status:</span>
                                        <span className={`text-sm font-medium ${syncStatus.status === 'success' ? 'text-green-600' : syncStatus.status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                                            {syncStatus.status || 'Ready'}
                                        </span>
                                    </div>
                                    {syncStatus.message && (
                                        <div className="text-sm text-gray-600 mt-2">
                                            {syncStatus.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">Generate Invoices</div>
                                    <div className="text-xs text-blue-600">Create invoices for approved orders</div>
                                </button>

                                <button className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">Shipping Labels</div>
                                    <div className="text-xs text-green-600">Generate labels for ready orders</div>
                                </button>

                                <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">Update Tracking</div>
                                    <div className="text-xs text-purple-600">Sync tracking codes from Tiny ERP</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}