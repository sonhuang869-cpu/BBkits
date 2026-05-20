import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import toast from "react-hot-toast";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

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

            {/* Clean & Professional Theme - Navy & Soft Gold */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

                :root {
                    --primary-color: #1E3A5F;
                    --primary-light: #2D4A6F;
                    --primary-dark: #152C4A;
                    --secondary-color: #475569;
                    --accent-color: #D4A574;
                    --accent-light: #E8C4A0;
                    --accent-dark: #B8956A;
                    --success-color: #0D9488;
                    --text-dark: #1F2937;
                    --text-light: #6B7280;
                    --text-muted: #9CA3AF;
                    --white: #FFFFFF;
                    --background: #FAFAFA;
                    --background-alt: #F8F6F4;
                    --gradient: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 50%, #475569 100%);
                    --gradient-accent: linear-gradient(135deg, #D4A574 0%, #E8C4A0 100%);
                    --gradient-hero: linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(71, 85, 105, 0.90) 100%);
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                }

                * {
                    font-family: 'Inter', sans-serif;
                }

                .register-bg {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .register-bg::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background:
                        radial-gradient(circle at 20% 80%, rgba(212, 165, 116, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 80% 20%, rgba(13, 148, 136, 0.1) 0%, transparent 40%);
                    pointer-events: none;
                }

                /* Premium Animated Background */
                .animated-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }

                /* Gradient Mesh Layer */
                .gradient-mesh {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background:
                        radial-gradient(ellipse 80% 50% at 20% 40%, rgba(212, 165, 116, 0.15) 0%, transparent 50%),
                        radial-gradient(ellipse 60% 80% at 80% 20%, rgba(13, 148, 136, 0.1) 0%, transparent 50%),
                        radial-gradient(ellipse 50% 60% at 40% 80%, rgba(30, 58, 95, 0.12) 0%, transparent 50%);
                    animation: meshMove 30s ease-in-out infinite;
                }

                @keyframes meshMove {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(5%, 3%) rotate(2deg); }
                    50% { transform: translate(0, 5%) rotate(0deg); }
                    75% { transform: translate(-5%, 2%) rotate(-2deg); }
                }

                /* Floating Orbs */
                .orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(40px);
                    opacity: 0.6;
                    animation: orbFloat 20s ease-in-out infinite;
                }

                .orb-1 {
                    width: 350px;
                    height: 350px;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.3) 0%, rgba(232, 196, 160, 0.1) 100%);
                    top: -10%;
                    right: -10%;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 280px;
                    height: 280px;
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(30, 58, 95, 0.15) 100%);
                    bottom: 5%;
                    left: -8%;
                    animation-delay: -7s;
                }

                .orb-3 {
                    width: 200px;
                    height: 200px;
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.25) 0%, rgba(71, 85, 105, 0.1) 100%);
                    top: 50%;
                    right: 15%;
                    animation-delay: -14s;
                }

                @keyframes orbFloat {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.5;
                    }
                    25% {
                        transform: translate(30px, -20px) scale(1.05);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translate(-20px, 30px) scale(0.95);
                        opacity: 0.6;
                    }
                    75% {
                        transform: translate(-30px, -10px) scale(1.02);
                        opacity: 0.5;
                    }
                }

                /* Particle Stars */
                .particles {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .particle {
                    position: absolute;
                    width: 4px;
                    height: 4px;
                    background: rgba(212, 165, 116, 0.6);
                    border-radius: 50%;
                    animation: particleFloat 15s ease-in-out infinite;
                    box-shadow: 0 0 10px rgba(212, 165, 116, 0.3);
                }

                @keyframes particleFloat {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(50px);
                        opacity: 0;
                    }
                }

                /* Glowing Lines */
                .glow-lines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .glow-line {
                    position: absolute;
                    width: 2px;
                    height: 100px;
                    background: linear-gradient(to bottom, transparent, rgba(212, 165, 116, 0.4), transparent);
                    animation: glowMove 8s linear infinite;
                    opacity: 0.5;
                }

                @keyframes glowMove {
                    0% {
                        transform: translateY(-100px) rotate(45deg);
                        opacity: 0;
                    }
                    50% {
                        opacity: 0.5;
                    }
                    100% {
                        transform: translateY(100vh) rotate(45deg);
                        opacity: 0;
                    }
                }

                .form-card {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: var(--shadow-xl);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .input-field {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid #E5E7EB;
                }

                .input-field:focus {
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 3px rgba(30, 58, 95, 0.1);
                }

                .btn-submit {
                    background: var(--gradient);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .btn-submit::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s;
                }

                .btn-submit:hover::before {
                    left: 100%;
                }

                .btn-submit:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .link-accent {
                    color: var(--primary-color);
                    transition: color 0.2s ease;
                }

                .link-accent:hover {
                    color: var(--accent-color);
                }
            `}</style>

            <div className="min-h-screen register-bg flex flex-col py-12 px-4">
                {/* Premium Animated Background */}
                <div className="animated-bg">
                    {/* Gradient Mesh */}
                    <div className="gradient-mesh" />

                    {/* Floating Orbs */}
                    <div className="orb orb-1" />
                    <div className="orb orb-2" />
                    <div className="orb orb-3" />

                    {/* Particles */}
                    <div className="particles">
                        {Array.from({ length: 15 }, (_, i) => (
                            <div
                                key={i}
                                className="particle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 15}s`,
                                    animationDuration: `${Math.random() * 10 + 10}s`,
                                    width: `${Math.random() * 4 + 2}px`,
                                    height: `${Math.random() * 4 + 2}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Glowing Lines */}
                    <div className="glow-lines">
                        {Array.from({ length: 4 }, (_, i) => (
                            <div
                                key={i}
                                className="glow-line"
                                style={{
                                    left: `${20 + i * 20}%`,
                                    animationDelay: `${i * 2}s`,
                                    animationDuration: `${6 + i}s`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Logo positioned at top-left */}
                <div className="w-full max-w-6xl mx-auto mb-8 relative z-10">
                    <div className="flex justify-start">
                        <Link href="/">
                            <img
                                src="/images/logo.webp"
                                alt="BBKits Logo"
                                className="h-14 w-auto object-contain transition-all duration-300 hover:scale-105 rounded-xl bg-white p-2 shadow-md"
                            />
                        </Link>
                    </div>
                </div>

                {/* Centered register form */}
                <div className="flex-1 flex items-center justify-center relative z-10">
                    <div className="w-full max-w-md">
                        {/* Clean Form Container */}
                        <div className="form-card p-8">
                            <h1 className="text-2xl font-bold text-center mb-2" style={{color: '#1E3A5F'}}>
                                Criar Conta
                            </h1>
                            <p className="text-center text-gray-500 mb-8 text-sm">
                                Junte-se as vendedoras de sucesso da BBkits
                            </p>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
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
                                    {errors.name && (
                                        <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
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
                                    {errors.email && (
                                        <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
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
                                    {errors.password && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Senha</label>
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
                                    {errors.password_confirmation && (
                                        <p className="mt-2 text-sm text-red-600">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="btn-submit w-full py-3 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? (
                                        <div className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Criando conta...
                                        </div>
                                    ) : (
                                        'Criar Minha Conta'
                                    )}
                                </button>

                                <div className="text-center pt-2">
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
                            <div className="mt-6 pt-6 border-t border-gray-100">
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
