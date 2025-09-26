import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function WATIDashboard({
    auth,
    stats,
    recentMessages,
    connectionStatus,
    templates
}) {
    const [testingConnection, setTestingConnection] = useState(false);
    const [sendingTest, setSendingTest] = useState(false);

    const testConnectionForm = useForm({});
    const testMessageForm = useForm({
        phone: '',
        message: 'Test message from BBKits'
    });

    const testConnection = () => {
        setTestingConnection(true);
        testConnectionForm.post('/admin/wati/test-connection', {
            onSuccess: () => {
                setTestingConnection(false);
            },
            onError: () => {
                setTestingConnection(false);
            }
        });
    };

    const sendTestMessage = () => {
        setSendingTest(true);
        testMessageForm.post('/admin/wati/send-test-message', {
            onSuccess: () => {
                setSendingTest(false);
            },
            onError: () => {
                setSendingTest(false);
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        WhatsApp (WATI) Integration
                    </h2>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={testConnection}
                            disabled={testingConnection}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                        >
                            {testingConnection ? 'Testing...' : 'Test Connection'}
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="WhatsApp (WATI) Integration" />

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
                                <div className="text-2xl font-bold text-green-600">{stats?.totalMessages || 0}</div>
                                <div className="text-sm text-gray-600">Total Messages Sent</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-blue-600">{stats?.deliveredMessages || 0}</div>
                                <div className="text-sm text-gray-600">Delivered</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-orange-600">{stats?.pendingMessages || 0}</div>
                                <div className="text-sm text-gray-600">Pending</div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <div className="text-2xl font-bold text-red-600">{stats?.failedMessages || 0}</div>
                                <div className="text-sm text-gray-600">Failed</div>
                            </div>
                        </div>
                    </div>

                    {/* Test Message */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Send Test Message</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phone Number (with country code)
                                    </label>
                                    <input
                                        type="text"
                                        value={testMessageForm.data.phone}
                                        onChange={e => testMessageForm.setData('phone', e.target.value)}
                                        placeholder="+5511999999999"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        value={testMessageForm.data.message}
                                        onChange={e => testMessageForm.setData('message', e.target.value)}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                                    />
                                </div>
                                <button
                                    onClick={sendTestMessage}
                                    disabled={sendingTest || !testMessageForm.data.phone}
                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50"
                                >
                                    {sendingTest ? 'Sending...' : 'Send Test Message'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Message Templates */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Message Templates</h3>
                            {templates && templates.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {templates.map((template, index) => (
                                        <div key={template.name || index} className="border border-gray-200 rounded-lg p-4">
                                            <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
                                            <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                                            <div className="bg-gray-50 p-3 rounded text-xs text-gray-700">
                                                {template.template}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No templates configured</h3>
                                    <p className="mt-1 text-sm text-gray-500">Configure message templates in your WATI dashboard.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Messages */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
                            {recentMessages && recentMessages.length > 0 ? (
                                <div className="space-y-3">
                                    {recentMessages.map((message, index) => (
                                        <div key={message.id || index} className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0">
                                            <div className={`w-2 h-2 rounded-full ${
                                                message.status === 'delivered' ? 'bg-green-500' :
                                                message.status === 'pending' ? 'bg-yellow-500' :
                                                message.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                                            }`}></div>
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {message.phone} - {message.template || 'Custom Message'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {message.status} - {new Date(message.sent_at).toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center text-gray-500 py-8">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No recent messages</h3>
                                    <p className="mt-1 text-sm text-gray-500">Messages will appear here once you start sending them.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">View Message Logs</div>
                                    <div className="text-xs text-green-600">See all sent messages and their status</div>
                                </button>

                                <button className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">Bulk Send</div>
                                    <div className="text-xs text-blue-600">Send notifications to multiple orders</div>
                                </button>

                                <button className="bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 px-4 py-3 rounded-lg text-sm font-medium text-left">
                                    <div className="font-semibold">Message Templates</div>
                                    <div className="text-xs text-purple-600">Manage notification templates</div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}