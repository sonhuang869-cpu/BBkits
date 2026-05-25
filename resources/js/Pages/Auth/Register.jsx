import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post('/register', {
            onFinish: () => reset("password", "password_confirmation"),
            onSuccess: () => {
                toast.success("Conta criada com sucesso!");
            },
            onError: (errors) => {
                Object.keys(errors).forEach((key) => {
                    toast.error(errors[key]);
                });
            },
        });
    };

    return (
        <>
            <Head title="Cadastro - BBKits" />

            <div className="min-h-screen register-bg flex flex-col py-8 px-4">
                {/* Premium Animated Background */}
                <div className="animated-bg">
                    {/* Aurora Effect */}
                    <div className="aurora" />

                    {/* Hexagon Pattern */}
                    <div className="hexagon-pattern" />

                    {/* Morphing Blobs */}
                    <div className="morph-blob morph-blob-1" />
                    <div className="morph-blob morph-blob-2" />
                    <div className="morph-blob morph-blob-3" />

                    {/* Floating Diamonds */}
                    <div className="diamond-container">
                        {Array.from({ length: 10 }, (_, i) => (
                            <div
                                key={`diamond-${i}`}
                                className="diamond"
                                style={{
                                    left: `${8 + i * 10}%`,
                                    top: `${100 + Math.random() * 20}%`,
                                    animationDelay: `${i * 2}s`,
                                    animationDuration: `${16 + Math.random() * 8}s`,
                                    width: `${6 + Math.random() * 10}px`,
                                    height: `${6 + Math.random() * 10}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Gold Sparkles */}
                    <div className="sparkle-container">
                        {Array.from({ length: 30 }, (_, i) => (
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
                        {Array.from({ length: 6 }, (_, i) => (
                            <div
                                key={`flow-${i}`}
                                className="flow-line"
                                style={{
                                    top: `${15 + i * 15}%`,
                                    animationDelay: `${i * 2.5}s`,
                                    animationDuration: `${10 + i * 2}s`,
                                    width: `${150 + Math.random() * 100}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Logo positioned at top-left */}
                <div className="w-full max-w-6xl mx-auto mb-6 relative z-10">
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

                {/* Centered register form */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="w-full max-w-md">
                        {/* Clean Form Container */}
                        <div className="form-card p-8">
                            <h1 className="form-title text-2xl font-bold text-center mb-2">
                                Criar Conta
                            </h1>
                            <p className="form-subtitle text-center text-gray-500 mb-1 text-sm">
                                Junte-se as vendedoras de sucesso da BBkits
                            </p>
                            <span className="subtitle-underline"></span>

                            <form onSubmit={submit} className="space-y-4 mt-6">
                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">
                                        Nome Completo
                                    </label>
                                    <div className="input-wrapper relative">
                                        <input
                                            id="name"
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                            autoComplete="name"
                                            autoFocus={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder="Digite seu nome completo"
                                            required
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">
                                        E-mail
                                    </label>
                                    <div className="input-wrapper relative">
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                            autoComplete="username"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">
                                        Senha
                                    </label>
                                    <div className="input-wrapper relative">
                                        <input
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password', e.target.value)}
                                            placeholder="Crie uma senha forte"
                                            required
                                        />
                                    </div>
                                    {data.password && (
                                        <div className={`password-strength ${data.password ? 'visible' : ''}`}>
                                            <div className={`password-strength-bar ${
                                                data.password.length >= 8 && /[A-Z]/.test(data.password) && /[0-9]/.test(data.password)
                                                    ? 'strong'
                                                    : data.password.length >= 6
                                                        ? 'medium'
                                                        : 'weak'
                                            }`}></div>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div className="input-group">
                                    <label className="input-label block text-sm font-medium text-gray-700 mb-1.5">
                                        Confirmar Senha
                                    </label>
                                    <div className="input-wrapper relative">
                                        <input
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900"
                                            autoComplete="new-password"
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            placeholder="Confirme sua senha"
                                            required
                                        />
                                        {data.password_confirmation && data.password === data.password_confirmation && (
                                            <svg className="success-icon visible absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-submit w-full py-3.5 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="spinner-enhanced -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando conta...
                                        </div>
                                    ) : (
                                        'Criar Minha Conta'
                                    )}
                                </button>

                                <div className="footer-links text-center pt-2">
                                    <span className="text-sm text-gray-500">Ja possui uma conta? </span>
                                    <Link
                                        href="/login"
                                        className="link-accent text-sm font-semibold"
                                    >
                                        Fazer Login
                                    </Link>
                                </div>
                            </form>

                            {/* Additional Info */}
                            <div className="terms-section mt-6 pt-6 border-t border-gray-100">
                                <div className="text-center text-xs text-gray-400">
                                    <p>
                                        Ao criar uma conta, voce concorda com nossos
                                    </p>
                                    <div className="space-x-2 mt-1">
                                        <a
                                            href="#"
                                            className="link-accent"
                                        >
                                            Termos de Uso
                                        </a>
                                        <span>e</span>
                                        <a
                                            href="#"
                                            className="link-accent"
                                        >
                                            Politica de Privacidade
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Font Awesome Icons */}
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        </>
    );
}
