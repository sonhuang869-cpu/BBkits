import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (status) {
            toast.success(status);
        }
    }, [status]);

    const submit = (e) => {
        e.preventDefault();

        post('/login', {
            onFinish: () => reset('password'),
            onSuccess: () => {
                toast.success('Login realizado com sucesso!');
            },
            onError: (errors) => {
                if (errors.email) {
                    toast.error(errors.email);
                }
                if (errors.password) {
                    toast.error(errors.password);
                }
            },
        });
    };

    return (
        <>
            <Head title="Entrar - BBKits" />

            <div className="min-h-screen login-bg flex flex-col py-12 px-4">
                {/* Premium Animated Background */}
                <div className="animated-bg">
                    {/* Aurora Effect */}
                    <div className="aurora" />

                    {/* Morphing Blobs */}
                    <div className="morph-blob morph-blob-1" />
                    <div className="morph-blob morph-blob-2" />
                    <div className="morph-blob morph-blob-3" />

                    {/* Floating Diamonds */}
                    <div className="diamond-container">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div
                                key={`diamond-${i}`}
                                className="diamond"
                                style={{
                                    left: `${10 + i * 12}%`,
                                    top: `${100 + Math.random() * 20}%`,
                                    animationDelay: `${i * 2.5}s`,
                                    animationDuration: `${18 + Math.random() * 8}s`,
                                    width: `${8 + Math.random() * 8}px`,
                                    height: `${8 + Math.random() * 8}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Gold Sparkles */}
                    <div className="sparkle-container">
                        {Array.from({ length: 25 }, (_, i) => (
                            <div
                                key={`sparkle-${i}`}
                                className="sparkle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 3}s`,
                                    animationDuration: `${2 + Math.random() * 2}s`,
                                    width: `${2 + Math.random() * 4}px`,
                                    height: `${2 + Math.random() * 4}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Flowing Lines */}
                    <div className="flow-lines">
                        {Array.from({ length: 5 }, (_, i) => (
                            <div
                                key={`flow-${i}`}
                                className="flow-line"
                                style={{
                                    top: `${20 + i * 18}%`,
                                    animationDelay: `${i * 3}s`,
                                    animationDuration: `${10 + i * 2}s`,
                                    width: `${150 + Math.random() * 100}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Logo positioned at top-left */}
                <div className="w-full max-w-6xl mx-auto mb-8 relative z-10">
                    <div className="flex justify-start">
                        <Link href="/" className="logo-container">
                            <img
                                src="/images/logo.webp"
                                alt="BBKits Logo"
                                className="h-10 w-auto object-contain"
                            />
                        </Link>
                    </div>
                </div>

                {/* Centered login form */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="w-full max-w-md">
                        {/* Clean Form Container */}
                        <div className="form-card p-8">
                            <h1 className="form-title text-2xl font-bold text-center mb-2">
                                Bem-vinda de Volta!
                            </h1>
                            <p className="form-subtitle text-center text-gray-500 mb-8 text-sm">
                                Acesse sua conta e continue vendendo
                            </p>

                            <form onSubmit={submit} method="POST" action="/login" className="space-y-5">
                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                        autoComplete="username"
                                        autoFocus={true}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="seu@email.com"
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                        autoComplete="current-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Digite sua senha"
                                    />
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="checkbox-wrapper flex items-center justify-between">
                                    <label className="flex items-center cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) => setData('remember', e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 focus:ring-2 transition-all duration-300"
                                            style={{accentColor: '#1E3A5F'}}
                                        />
                                        <span className="ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                                            Lembrar-me
                                        </span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href="/forgot-password"
                                            className="link-accent text-sm font-medium"
                                        >
                                            Esqueceu a senha?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-submit w-full py-3.5 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="spinner-enhanced -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Entrando...
                                        </div>
                                    ) : (
                                        'Entrar'
                                    )}
                                </button>

                                <div className="footer-links text-center pt-2">
                                    <span className="text-sm text-gray-500">Ainda nao tem uma conta? </span>
                                    <Link
                                        href="/register"
                                        className="link-accent text-sm font-semibold"
                                    >
                                        Criar Conta
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Font Awesome Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </>
    );
}
