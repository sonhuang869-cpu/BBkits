import { Head, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Welcome({ auth }) {
    const [scrollY, setScrollY] = useState(0);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <>
            <Head title="BBKits - Sistema de Vendas" />

            <div className="min-h-screen hero-gradient relative overflow-hidden">
                {/* Premium Animated Background */}
                <div className="animated-bg">
                    {/* Cosmic Aurora */}
                    <div className="aurora" />

                    {/* Geometric Pattern */}
                    <div className="geo-pattern" />

                    {/* Morphing Blobs */}
                    <div className="morph-blob morph-blob-1" />
                    <div className="morph-blob morph-blob-2" />
                    <div className="morph-blob morph-blob-3" />

                    {/* Wave Animation */}
                    <div className="wave-container">
                        <div className="wave" />
                        <div className="wave wave-2" />
                        <div className="wave wave-3" />
                    </div>

                    {/* Floating Diamonds */}
                    <div className="diamond-container">
                        {Array.from({ length: 12 }, (_, i) => (
                            <div
                                key={`diamond-${i}`}
                                className="diamond"
                                style={{
                                    left: `${5 + i * 8}%`,
                                    top: `${100 + Math.random() * 20}%`,
                                    animationDelay: `${i * 2}s`,
                                    animationDuration: `${20 + Math.random() * 10}s`,
                                    width: `${8 + Math.random() * 12}px`,
                                    height: `${8 + Math.random() * 12}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Gold Sparkles */}
                    <div className="sparkle-container">
                        {Array.from({ length: 40 }, (_, i) => (
                            <div
                                key={`sparkle-${i}`}
                                className="sparkle"
                                style={{
                                    left: `${Math.random() * 100}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 4}s`,
                                    animationDuration: `${3 + Math.random() * 3}s`,
                                    width: `${3 + Math.random() * 5}px`,
                                    height: `${3 + Math.random() * 5}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Flowing Lines */}
                    <div className="flow-lines">
                        {Array.from({ length: 8 }, (_, i) => (
                            <div
                                key={`flow-${i}`}
                                className="flow-line"
                                style={{
                                    top: `${10 + i * 12}%`,
                                    animationDelay: `${i * 2}s`,
                                    animationDuration: `${12 + i * 2}s`,
                                    width: `${200 + Math.random() * 150}px`,
                                }}
                            />
                        ))}
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 relative z-10">
                    {/* Navigation */}
                    <nav className="navbar-clean flex items-center justify-between mb-16 px-8 py-5">
                        <div className="flex items-center">
                            <Link href="/" className="logo-container">
                                <img
                                    src="/images/logo.webp"
                                    alt="BBKits Logo"
                                    className="h-10 w-auto object-contain"
                                />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href="/dashboard"
                                    className="btn-primary text-white px-8 py-3 rounded-xl font-semibold text-base tracking-wide"
                                >
                                    Acessar Sistema
                                </Link>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href="/login"
                                        className="btn-login px-6 py-2.5 rounded-xl text-sm"
                                    >
                                        Entrar
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="btn-register px-6 py-2.5 rounded-xl text-sm"
                                    >
                                        Cadastrar
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto text-white pt-8 pb-24">
                        <h1 className="hero-title mb-6 leading-tight">
                            <span className="hero-title-main text-5xl md:text-6xl lg:text-7xl font-black">
                                BBkits
                            </span>
                            <span className="hero-subtitle-line block text-3xl md:text-4xl lg:text-5xl mt-4 font-medium text-white/90">
                                Sistema de Vendas Premium
                            </span>
                        </h1>

                        <p className="hero-description text-lg md:text-xl mb-12 leading-relaxed text-white/85 max-w-2xl mx-auto font-light">
                            Plataforma completa para gestao de vendas, controle
                            de comissoes e acompanhamento de metas para
                            vendedoras de bolsas maternidade premium
                        </p>

                        {!auth.user && (
                            <div className="hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16">
                                <Link
                                    href="/login"
                                    className="btn-outline px-8 py-4 rounded-xl text-lg font-semibold"
                                >
                                    Fazer Login
                                </Link>
                                <Link
                                    href="/register"
                                    className="btn-accent px-8 py-4 rounded-xl text-lg font-bold"
                                >
                                    Quero ser uma vendedora BBkits
                                </Link>
                            </div>
                        )}

                        {/* Hero Icons */}
                        <div className="hero-icons flex justify-center gap-6 mb-8">
                            <div className="icon-circle text-xl text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </div>
                            <div className="icon-circle text-xl text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                </svg>
                            </div>
                            <div className="icon-circle text-xl text-white">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"/>
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <div className="scroll-indicator">
                        <div className="scroll-indicator-inner">
                            <div className="scroll-indicator-dot"></div>
                        </div>
                    </div>
                </div>

                {/* Features Section */}
                <div className="features-section bg-white/98 backdrop-blur-sm">
                    <div className="container mx-auto px-4 py-20">
                        <div className="text-center mb-16">
                            <h2 className="section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                                Como Funciona o Sistema
                            </h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Um processo simples e transparente para o seu
                                sucesso
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8 mt-12">
                            <div className="card-clean p-8 text-center group">
                                <div className="w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    Controle de Vendas
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Registre suas vendas com comprovantes e
                                    acompanhe o status de aprovacao em tempo
                                    real atraves do seu painel personalizado.
                                </p>
                            </div>

                            <div className="card-clean p-8 text-center group">
                                <div className="w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    Calculo de Comissoes
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Sistema automatico de calculo de comissoes
                                    baseado em metas e valores recebidos com
                                    transparencia total.
                                </p>
                            </div>

                            <div className="card-clean p-8 text-center group">
                                <div className="w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                        />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">
                                    Dashboard Motivacional
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Acompanhe seu progresso, ranking e metas com
                                    interface gamificada e motivacional que
                                    impulsiona seu sucesso.
                                </p>
                            </div>
                        </div>

                        {/* Motivational Quote */}
                        <div className="mt-20 quote-section p-12 text-white text-center">
                            <h2 className="quote-text text-2xl md:text-3xl font-bold mb-6">
                                "Voce nao vende bolsas. Voce entrega historias,
                                seguranca e amor."
                            </h2>
                            <div className="flex justify-center items-center gap-4 text-2xl mb-4">
                                <span className="gold-accent">
                                    <svg className="w-6 h-6 inline" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                    </svg>
                                </span>
                                <span>&#128188;</span>
                                <span>&#128118;</span>
                                <span className="gold-accent">
                                    <svg className="w-6 h-6 inline" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                                    </svg>
                                </span>
                            </div>
                            <p className="text-white/90 text-lg font-medium">
                                Sistema desenvolvido especialmente para as
                                vendedoras BBKits
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Font Awesome Icons */}
            <link
                rel="stylesheet"
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
            />
        </>
    );
}
