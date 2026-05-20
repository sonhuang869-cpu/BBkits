import Dropdown from "@/Components/Dropdown";
import DropdownMenu from "@/Components/DropdownMenu";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import NotificationBell from "@/Components/NotificationBell";
import { Link, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    // Permission helpers
    const canViewMaterials = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    const canViewSuppliers = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    const canViewInventory = () => {
        return ['admin', 'manager', 'production_admin', 'finance_admin', 'financeiro'].includes(user.role);
    };

    const isAdmin = () => {
        return user.role === 'admin';
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
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
                    --gradient-soft: linear-gradient(135deg, #F8F6F4 0%, #FFFFFF 100%);
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-gold: 0 0 20px rgba(212, 165, 116, 0.3);
                }

                * {
                    font-family: 'Inter', sans-serif;
                }

                .premium-bg {
                    background: linear-gradient(135deg, #F8F6F4 0%, #FFFFFF 30%, #FAFAFA 70%, #F8F6F4 100%);
                    position: relative;
                    overflow: hidden;
                }

                /* Premium Animated Background */
                .animated-bg-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                    z-index: 0;
                }

                /* Gradient Mesh Layer */
                .gradient-mesh {
                    position: absolute;
                    width: 200%;
                    height: 200%;
                    top: -50%;
                    left: -50%;
                    background:
                        radial-gradient(ellipse 60% 40% at 15% 30%, rgba(212, 165, 116, 0.06) 0%, transparent 50%),
                        radial-gradient(ellipse 50% 60% at 85% 70%, rgba(13, 148, 136, 0.04) 0%, transparent 50%),
                        radial-gradient(ellipse 40% 50% at 50% 50%, rgba(30, 58, 95, 0.05) 0%, transparent 50%);
                    animation: meshFloat 40s ease-in-out infinite;
                }

                @keyframes meshFloat {
                    0%, 100% { transform: translate(0, 0) rotate(0deg) scale(1); }
                    25% { transform: translate(3%, 2%) rotate(1deg) scale(1.02); }
                    50% { transform: translate(0, 4%) rotate(0deg) scale(1); }
                    75% { transform: translate(-3%, 1%) rotate(-1deg) scale(0.98); }
                }

                /* Floating Orbs - Subtle */
                .float-orb {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(60px);
                    opacity: 0.4;
                    animation: orbDrift 25s ease-in-out infinite;
                }

                .float-orb-1 {
                    width: 500px;
                    height: 500px;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.15) 0%, rgba(232, 196, 160, 0.05) 100%);
                    top: -15%;
                    right: -15%;
                    animation-delay: 0s;
                }

                .float-orb-2 {
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.1) 0%, rgba(30, 58, 95, 0.08) 100%);
                    bottom: -10%;
                    left: -10%;
                    animation-delay: -8s;
                }

                .float-orb-3 {
                    width: 350px;
                    height: 350px;
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.12) 0%, rgba(71, 85, 105, 0.06) 100%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: -16s;
                }

                @keyframes orbDrift {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: 0.3;
                    }
                    33% {
                        transform: translate(40px, -30px) scale(1.05);
                        opacity: 0.5;
                    }
                    66% {
                        transform: translate(-30px, 40px) scale(0.95);
                        opacity: 0.4;
                    }
                }

                /* Subtle Grid Pattern */
                .grid-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-image:
                        linear-gradient(rgba(30, 58, 95, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(30, 58, 95, 0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                    animation: gridPulse 10s ease-in-out infinite;
                }

                @keyframes gridPulse {
                    0%, 100% { opacity: 0.5; }
                    50% { opacity: 0.8; }
                }

                /* Particle Dots */
                .particle-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                }

                .particle-dot {
                    position: absolute;
                    width: 3px;
                    height: 3px;
                    background: rgba(212, 165, 116, 0.4);
                    border-radius: 50%;
                    animation: particleRise 20s ease-in-out infinite;
                    box-shadow: 0 0 6px rgba(212, 165, 116, 0.2);
                }

                @keyframes particleRise {
                    0%, 100% {
                        transform: translateY(0) translateX(0) scale(1);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.6;
                    }
                    50% {
                        transform: translateY(-50vh) translateX(20px) scale(1.2);
                        opacity: 0.4;
                    }
                    90% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(-100vh) translateX(0) scale(1);
                        opacity: 0;
                    }
                }

                /* Glowing Accent Lines */
                .accent-line {
                    position: absolute;
                    width: 1px;
                    height: 150px;
                    background: linear-gradient(
                        to bottom,
                        transparent,
                        rgba(212, 165, 116, 0.3),
                        rgba(212, 165, 116, 0.5),
                        rgba(212, 165, 116, 0.3),
                        transparent
                    );
                    animation: lineTravel 12s linear infinite;
                    opacity: 0;
                }

                @keyframes lineTravel {
                    0% {
                        transform: translateY(-150px) rotate(30deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0.6;
                    }
                    90% {
                        opacity: 0.6;
                    }
                    100% {
                        transform: translateY(100vh) rotate(30deg);
                        opacity: 0;
                    }
                }

                /* Morphing Shape */
                .morph-shape {
                    position: absolute;
                    width: 600px;
                    height: 600px;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.03) 0%, rgba(212, 165, 116, 0.02) 100%);
                    border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    animation: morphing 20s ease-in-out infinite;
                    filter: blur(40px);
                }

                @keyframes morphing {
                    0%, 100% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                        transform: translate(-50%, -50%) rotate(0deg);
                    }
                    25% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                        transform: translate(-50%, -50%) rotate(90deg);
                    }
                    50% {
                        border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
                        transform: translate(-50%, -50%) rotate(180deg);
                    }
                    75% {
                        border-radius: 60% 40% 60% 50% / 70% 30% 60% 50%;
                        transform: translate(-50%, -50%) rotate(270deg);
                    }
                }

                .navbar-glass {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(30, 58, 95, 0.08);
                    box-shadow: var(--shadow-sm);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .navbar-scrolled {
                    background: rgba(255, 255, 255, 1);
                    backdrop-filter: blur(25px);
                    box-shadow: var(--shadow);
                    border-bottom: 2px solid var(--accent-color);
                }

                .logo-container {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                .logo-container:hover {
                    transform: scale(1.05);
                }

                .nav-link {
                    position: relative;
                    padding: 6px 10px;
                    border-radius: 10px;
                    font-weight: 500;
                    font-size: 0.75rem;
                    color: var(--text-dark);
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    overflow: hidden;
                    white-space: nowrap;
                }

                @media (min-width: 640px) {
                    .nav-link {
                        padding: 6px 12px;
                        font-size: 0.8125rem;
                    }
                }

                @media (min-width: 768px) {
                    .nav-link {
                        padding: 8px 14px;
                        font-size: 0.875rem;
                        border-radius: 12px;
                    }
                }

                @media (min-width: 1024px) {
                    .nav-link {
                        padding: 10px 16px;
                        font-size: 0.9375rem;
                        font-weight: 500;
                    }
                }

                @media (min-width: 1280px) {
                    .nav-link {
                        padding: 10px 18px;
                        font-size: 0.9375rem;
                    }
                }

                .nav-link:hover {
                    background: rgba(30, 58, 95, 0.06);
                    color: var(--primary-color);
                    transform: translateY(-1px);
                }

                .nav-link.active {
                    background: var(--gradient);
                    color: white;
                    box-shadow: var(--shadow);
                }

                .user-dropdown {
                    background: var(--gradient-soft);
                    border: 1px solid rgba(30, 58, 95, 0.1);
                    border-radius: 12px;
                    padding: 4px 8px;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }

                @media (min-width: 768px) {
                    .user-dropdown {
                        padding: 6px 12px;
                        border-radius: 14px;
                    }
                }

                @media (min-width: 1024px) {
                    .user-dropdown {
                        padding: 8px 16px;
                        border-radius: 16px;
                    }
                }

                .user-dropdown:hover {
                    transform: translateY(-1px);
                    box-shadow: var(--shadow);
                    border-color: var(--accent-color);
                }

                .user-avatar {
                    background: var(--gradient);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    transition: all 0.2s ease;
                    box-shadow: var(--shadow-sm);
                }

                .user-avatar:hover {
                    transform: scale(1.05);
                    box-shadow: var(--shadow);
                }

                .dropdown-content {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(30, 58, 95, 0.1);
                    border-radius: 16px;
                    box-shadow: var(--shadow-lg);
                    overflow: hidden;
                    margin-top: 2px;
                }

                .dropdown-header {
                    background: var(--gradient-soft);
                    padding: 16px;
                    border-bottom: 1px solid rgba(30, 58, 95, 0.08);
                }

                .dropdown-link {
                    padding: 12px 16px;
                    transition: all 0.2s ease;
                    border-radius: 0;
                    margin: 4px 8px;
                    border-radius: 10px;
                    color: var(--text-dark);
                }

                .dropdown-link:hover {
                    background: rgba(30, 58, 95, 0.06);
                    color: var(--primary-color);
                    transform: translateX(4px);
                }

                .dropdown-link svg {
                    color: var(--text-light);
                    transition: color 0.2s ease;
                }

                .dropdown-link:hover svg {
                    color: var(--primary-color);
                }

                .mobile-menu {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(20px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border-bottom: 1px solid rgba(30, 58, 95, 0.08);
                }

                .mobile-toggle {
                    background: var(--gradient-soft);
                    border-radius: 10px;
                    padding: 6px;
                    transition: all 0.2s ease;
                    border: 1px solid rgba(30, 58, 95, 0.1);
                }

                @media (min-width: 640px) {
                    .mobile-toggle {
                        padding: 8px;
                        border-radius: 12px;
                    }
                }

                .mobile-toggle:hover {
                    background: var(--gradient);
                    color: white;
                    transform: scale(1.05);
                    box-shadow: var(--shadow);
                }

                .header-section {
                    background: var(--gradient-soft);
                    border-bottom: 1px solid rgba(30, 58, 95, 0.08);
                    box-shadow: var(--shadow-sm);
                    position: relative;
                    overflow: hidden;
                }

                .header-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(45deg, rgba(30, 58, 95, 0.02) 0%, rgba(212, 165, 116, 0.02) 100%);
                    pointer-events: none;
                }

                .main-content {
                    position: relative;
                    z-index: 1;
                }

                .animate-fadeInUp {
                    animation: fadeInUp 0.6s ease-out forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }

                .animate-fadeInUp.delay-200 {
                    animation-delay: 0.15s;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .icon-hover {
                    transition: all 0.2s ease;
                }

                .icon-hover:hover {
                    transform: scale(1.1);
                    color: var(--primary-color);
                }

                /* Mobile responsive menu animations */
                .mobile-nav-item {
                    transition: all 0.2s ease;
                    margin: 4px 0;
                }

                .mobile-nav-item:hover {
                    transform: translateX(8px);
                    background: rgba(30, 58, 95, 0.06);
                    border-radius: 12px;
                }

                /* Custom scrollbar */
                ::-webkit-scrollbar {
                    width: 6px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f1f1;
                }

                ::-webkit-scrollbar-thumb {
                    background: var(--gradient);
                    border-radius: 3px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: var(--primary-color);
                }

                /* Enhanced icon styling */
                .nav-icon {
                    width: 0.875rem;
                    height: 0.875rem;
                    color: var(--text-light);
                    transition: all 0.2s ease;
                }

                .nav-link:hover .nav-icon {
                    color: var(--primary-color);
                }

                .nav-link.active .nav-icon {
                    color: white;
                }

                @media (min-width: 768px) {
                    .nav-icon {
                        width: 1rem;
                        height: 1rem;
                    }
                }

                @media (min-width: 1024px) {
                    .nav-icon {
                        width: 1.125rem;
                        height: 1.125rem;
                    }
                }

                /* Hide text on smaller screens, show icons only */
                .nav-text {
                    display: none;
                }

                @media (min-width: 900px) {
                    .nav-text {
                        display: inline;
                    }
                }

                /* Compact navigation for tablets */
                @media (max-width: 1024px) {
                    .nav-link {
                        padding: 8px 10px;
                        gap: 0;
                    }

                    .nav-icon {
                        width: 1.125rem;
                        height: 1.125rem;
                    }
                }

                /* Adjust navbar height */
                .navbar-height {
                    height: 3rem;
                }

                @media (min-width: 640px) {
                    .navbar-height {
                        height: 3.5rem;
                    }
                }

                @media (min-width: 768px) {
                    .navbar-height {
                        height: 3.75rem;
                    }
                }

                @media (min-width: 1024px) {
                    .navbar-height {
                        height: 4rem;
                    }
                }

                /* Role badge styling */
                .role-badge {
                    color: var(--accent-color);
                    font-weight: 500;
                }
            `}</style>

            <div className="min-h-screen premium-bg">
                {/* Premium Animated Background */}
                <div className="animated-bg-container">
                    {/* Gradient Mesh */}
                    <div className="gradient-mesh" />

                    {/* Grid Pattern */}
                    <div className="grid-pattern" />

                    {/* Morphing Shape */}
                    <div className="morph-shape" />

                    {/* Floating Orbs */}
                    <div className="float-orb float-orb-1" />
                    <div className="float-orb float-orb-2" />
                    <div className="float-orb float-orb-3" />

                    {/* Particle Dots */}
                    <div className="particle-container">
                        {Array.from({ length: 15 }, (_, i) => (
                            <div
                                key={i}
                                className="particle-dot"
                                style={{
                                    left: `${5 + Math.random() * 90}%`,
                                    top: `${Math.random() * 100}%`,
                                    animationDelay: `${Math.random() * 20}s`,
                                    animationDuration: `${15 + Math.random() * 10}s`,
                                    width: `${2 + Math.random() * 3}px`,
                                    height: `${2 + Math.random() * 3}px`,
                                }}
                            />
                        ))}
                    </div>

                    {/* Accent Lines */}
                    {Array.from({ length: 4 }, (_, i) => (
                        <div
                            key={i}
                            className="accent-line"
                            style={{
                                left: `${15 + i * 20}%`,
                                animationDelay: `${i * 3}s`,
                                animationDuration: `${10 + i * 2}s`,
                            }}
                        />
                    ))}
                </div>

                <nav
                    className={`fixed top-0 w-full z-50 navbar-glass ${
                        isScrolled ? "navbar-scrolled" : ""
                    }`}
                >
                    <div className="mx-auto w-full max-w-[100%] px-2 sm:px-3 md:px-4 lg:px-6 xl:max-w-7xl xl:px-8">
                        <div className="navbar-height flex justify-between items-center">
                            <div className="flex items-center flex-shrink-0">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/" className="logo-container">
                                        <img
                                            src="/images/logo.webp"
                                            alt="BBKits Logo"
                                            className="h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10 w-auto object-contain transition-all duration-300 rounded-lg bg-white p-0.5 sm:p-0.75 lg:p-1 shadow-sm"
                                        />
                                    </Link>
                                </div>

                                <div className="hidden md:flex items-center space-x-0.5 lg:space-x-1 xl:space-x-2 ms-2 sm:ms-3 md:ms-4 lg:ms-6 xl:ms-10">
                                    <NavLink
                                        href="/dashboard"
                                        active={window.location.pathname === "/dashboard"}
                                        className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                            window.location.pathname === "/dashboard" ? "active" : ""
                                        }`}
                                    >
                                        <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
                                        </svg>
                                        <span className="nav-text">Dashboard</span>
                                    </NavLink>

                                    <NavLink
                                        href="/sales"
                                        active={window.location.pathname === "/sales"}
                                        className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                            window.location.pathname === "/sales" ? "active" : ""
                                        }`}
                                    >
                                        <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h5c.55 0 1 .45 1 1s-.45 1-1 1h-1v11c0 1.66-1.34 3-3 3H6c-1.66 0-3-1.34-3-3V6H2c-.55 0-1-.45-1-1s.45-1 1-1h5Zm2-1v1h6V3H9Zm6.5 15L19 14.5l-1.41-1.41L15 15.67l-1.59-1.58L12 15.5 15.5 18Z" />
                                        </svg>
                                        <span className="nav-text">Vendas</span>
                                    </NavLink>

                                    <NavLink
                                        href="/sales/kanban"
                                        active={window.location.pathname === "/sales/kanban"}
                                        className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                            window.location.pathname === "/sales/kanban" ? "active" : ""
                                        }`}
                                    >
                                        <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5V5h7v12zm3-7h4v2h-4v-2zm0-3h4v2h-4V7zm0 6h4v2h-4v-2z"/>
                                        </svg>
                                        <span className="nav-text">Kanban</span>
                                    </NavLink>

                                    {/* Finance Admin Navigation */}
                                    {(user.role === "finance_admin" || user.role === "financeiro" || user.role === "admin") && (
                                        <NavLink
                                            href="/finance/orders"
                                            active={window.location.pathname.includes("/finance")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/finance") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z"/>
                                            </svg>
                                            <span className="nav-text">Financeiro</span>
                                        </NavLink>
                                    )}

                                    {/* Production Admin Navigation */}
                                    {(user.role === "production_admin" || user.role === "admin") && (
                                        <NavLink
                                            href="/production/orders"
                                            active={window.location.pathname.includes("/production")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/production") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/>
                                            </svg>
                                            <span className="nav-text">Producao</span>
                                        </NavLink>
                                    )}

                                    {/* Manager Dashboard */}
                                    {(user.role === "manager" || user.role === "admin") && (
                                        <NavLink
                                            href="/manager/dashboard"
                                            active={window.location.pathname.includes("/manager")}
                                            className={`nav-link flex items-center gap-0.5 lg:gap-1 xl:gap-2 ${
                                                window.location.pathname.includes("/manager") ? "active" : ""
                                            }`}
                                        >
                                            <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                                                <path d="M18 11h-4v2h4v-2zm0 4h-4v2h4v-2z"/>
                                            </svg>
                                            <span className="nav-text">Gerencia</span>
                                        </NavLink>
                                    )}

                                    {/* Admin Dropdown Menu */}
                                    {(user.role === "admin" || user.role === "financeiro") && (
                                        <DropdownMenu
                                            trigger={
                                                <>
                                                    <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"/>
                                                        <path d="M10 11l2 2 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className="nav-text">Admin</span>
                                                    <svg className="nav-icon ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            }
                                        >
                                            <Link
                                                href="/admin/dashboard"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M13 9V3h8v6h-8ZM3 13V3h8v10H3Zm10 8V11h8v10h-8ZM3 21v-6h8v6H3Z" />
                                                </svg>
                                                Dashboard Admin
                                            </Link>
                                            <Link
                                                href="/admin/users"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM12 14a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7Z"/>
                                                </svg>
                                                Usuarios
                                            </Link>
                                            <Link
                                                href="/admin/sales"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4Z"/>
                                                </svg>
                                                Painel Financeiro
                                            </Link>
                                            <Link
                                                href="/admin/embroidery"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M9.5 16a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13ZM9.5 4a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11Z"/>
                                                    <path d="M6.5 9.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Z"/>
                                                </svg>
                                                Bordados
                                            </Link>
                                            <Link
                                                href="/admin/products"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M20 6h-4V4c0-1.1-.9-2-2-2h-4c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM10 4h4v2h-4V4zm10 16H4V8h16v12z"/>
                                                </svg>
                                                Produtos
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link
                                                    href="/admin/permissions"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4Z"/>
                                                    </svg>
                                                    Permissoes
                                                </Link>
                                            )}
                                            {['admin', 'manager'].includes(user.role) && (
                                                <Link
                                                    href="/admin/reports"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M7 18h2V6H7v12Zm4 0h2v-6h-2v6Zm4 0h2V2h-2v16Z"/>
                                                    </svg>
                                                    Relatorios
                                                </Link>
                                            )}
                                            {user.role === 'admin' && (
                                                <>
                                                    <Link
                                                        href="/admin/tiny-erp"
                                                        className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                                                        </svg>
                                                        Tiny ERP
                                                    </Link>
                                                    <Link
                                                        href="/admin/wati"
                                                        className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                    >
                                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.488"/>
                                                        </svg>
                                                        WhatsApp (WATI)
                                                    </Link>
                                                </>
                                            )}
                                        </DropdownMenu>
                                    )}

                                    {/* Materials Management Dropdown */}
                                    {canViewMaterials() && (
                                        <DropdownMenu
                                            trigger={
                                                <>
                                                    <svg className="nav-icon icon-hover" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2 2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5Z"/>
                                                        <path d="m8 10 4 4 4-4" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    <span className="nav-text">Materiais</span>
                                                    <svg className="nav-icon ml-1 h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            }
                                        >
                                            <Link
                                                href="/admin/materials"
                                                className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                            >
                                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 2 2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5Z"/>
                                                </svg>
                                                Gerenciar Materiais
                                            </Link>
                                            {canViewSuppliers() && (
                                                <Link
                                                    href="/admin/suppliers"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10z"/>
                                                    </svg>
                                                    Fornecedores
                                                </Link>
                                            )}
                                            {canViewInventory() && (
                                                <Link
                                                    href="/admin/inventory"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"/>
                                                        <path d="M14 2v6h6M16 13H8m8 4H8m2-8H8" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                                    </svg>
                                                    Transacoes de Estoque
                                                </Link>
                                            )}
                                            {isAdmin() && (
                                                <Link
                                                    href="/admin/bom"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                                                        <path d="M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
                                                        <path d="M9 12h6m-6 4h6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                                                    </svg>
                                                    Fichas Tecnicas (BOM)
                                                </Link>
                                            )}
                                            {isAdmin() && (
                                                <Link
                                                    href="/admin/color-mapping"
                                                    className="dropdown-link flex items-center gap-3 px-4 py-2 text-sm rounded-lg"
                                                >
                                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                                        <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                                    </svg>
                                                    Mapeamento de Cores
                                                </Link>
                                            )}
                                        </DropdownMenu>
                                    )}
                                </div>
                            </div>

                            <div className="hidden md:flex md:items-center md:gap-2 lg:gap-3">
                                <NotificationBell />
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="user-dropdown"
                                                >
                                                    <div className="flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                                                        <div className="user-avatar w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[10px] sm:text-xs">
                                                            {user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </div>
                                                        <span className="hidden lg:block font-medium text-xs lg:text-sm xl:text-base text-gray-700">
                                                            {user.name}
                                                        </span>
                                                        <svg
                                                            className="-me-0.5 ms-1 lg:ms-2 h-3 w-3 lg:h-4 lg:w-4 transition-transform duration-200 group-hover:rotate-180"
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </div>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="dropdown-content w-64">
                                            <div className="dropdown-header">
                                                <div className="flex items-center gap-3">
                                                    <div className="user-avatar w-12 h-12 text-sm">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-800">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {user.email}
                                                        </div>
                                                        <div className="text-xs role-badge mt-1">
                                                            {user.role ===
                                                            "vendedora"
                                                                ? "Vendedora BBKits"
                                                                : user.role ===
                                                                  "admin"
                                                                ? "Administrador"
                                                                : user.role === "finance_admin"
                                                                ? "Financeiro Admin"
                                                                : user.role === "production_admin"
                                                                ? "Producao Admin"
                                                                : "Financeiro"}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <Dropdown.Link
                                                href="/profile"
                                                className="dropdown-link flex items-center gap-3"
                                            >
                                                <svg
                                                    className="w-4 h-4 icon-hover"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Meu Perfil
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="dropdown-link flex items-center gap-3 text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                                            >
                                                <svg
                                                    className="w-4 h-4 icon-hover"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Sair
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>

                            <div className="-me-2 flex items-center md:hidden">
                                <button
                                    onClick={() =>
                                        setShowingNavigationDropdown(
                                            !showingNavigationDropdown
                                        )
                                    }
                                    className="mobile-toggle"
                                >
                                    <div className="relative w-5 h-5 sm:w-6 sm:h-6">
                                        <div
                                            className={`absolute inset-0 transition-all duration-200 ${
                                                showingNavigationDropdown
                                                    ? "opacity-0 rotate-45"
                                                    : "opacity-100 rotate-0"
                                            }`}
                                        >
                                            <svg
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                        </div>
                                        <div
                                            className={`absolute inset-0 transition-all duration-200 ${
                                                showingNavigationDropdown
                                                    ? "opacity-100 rotate-0"
                                                    : "opacity-0 -rotate-45"
                                            }`}
                                        >
                                            <svg
                                                className="h-5 w-5 sm:h-6 sm:w-6"
                                                stroke="currentColor"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth="2"
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`md:hidden mobile-menu transition-all duration-300 ease-in-out overflow-hidden ${
                            showingNavigationDropdown
                                ? "max-h-screen opacity-100"
                                : "max-h-0 opacity-0"
                        }`}
                    >
                        <div className="space-y-2 pb-4 pt-4 px-4">
                            <ResponsiveNavLink
                                href="/dashboard"
                                active={window.location.pathname === "/dashboard"}
                                className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                            >
                                <svg
                                    className="w-4 h-4 icon-hover"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                                    />
                                </svg>
                                Dashboard
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href="/sales"
                                active={window.location.pathname === "/sales"}
                                className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                            >
                                <svg
                                    className="w-4 h-4 icon-hover"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                    />
                                </svg>
                                Minhas Vendas
                            </ResponsiveNavLink>

                            <ResponsiveNavLink
                                href="/sales/kanban"
                                active={window.location.pathname === "/sales/kanban"}
                                className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                            >
                                <svg
                                    className="w-4 h-4 icon-hover"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H5V5h7v12zm3-7h4v2h-4v-2zm0-3h4v2h-4V7zm0 6h4v2h-4v-2z"/>
                                </svg>
                                Kanban
                            </ResponsiveNavLink>

                            {/* Finance Admin Mobile Navigation */}
                            {(user.role === "finance_admin" || user.role === "financeiro" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href="/finance/orders"
                                    active={window.location.pathname.includes("/finance")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                    Financeiro
                                </ResponsiveNavLink>
                            )}

                            {/* Production Admin Mobile Navigation */}
                            {(user.role === "production_admin" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href="/production/orders"
                                    active={window.location.pathname.includes("/production")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 7.172V5L8 4z" />
                                    </svg>
                                    Producao
                                </ResponsiveNavLink>
                            )}

                            {(user.role === "admin" ||
                                user.role === "financeiro") && (
                                <>
                                    <ResponsiveNavLink
                                        href="/admin/dashboard"
                                        active={window.location.pathname === "/admin/dashboard"}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                            />
                                        </svg>
                                        Admin Dashboard
                                    </ResponsiveNavLink>

                            {/* Manager Dashboard Mobile */}
                            {(user.role === "manager" || user.role === "admin") && (
                                <ResponsiveNavLink
                                    href="/manager/dashboard"
                                    active={window.location.pathname.includes("/manager")}
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
                                    Dashboard Gerencial
                                </ResponsiveNavLink>
                            )}

                                    <ResponsiveNavLink
                                        href="/admin/users"
                                        active={window.location.pathname === "/admin/users"}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M19 7.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                            />
                                        </svg>
                                        Gerenciar Usuarios
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href="/admin/sales"
                                        active={window.location.pathname.includes("/admin/sales")}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
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
                                        Painel Financeiro
                                    </ResponsiveNavLink>

                                    <ResponsiveNavLink
                                        href="/admin/embroidery"
                                        active={window.location.pathname.includes('/admin/embroidery')}
                                        className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                    >
                                        <svg
                                            className="w-4 h-4 icon-hover"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                                            />
                                        </svg>
                                        Gerenciar Bordados
                                    </ResponsiveNavLink>

                                    {/* Materials Management Mobile Navigation */}
                                    {canViewMaterials() && (
                                        <ResponsiveNavLink
                                            href="/admin/materials"
                                            active={window.location.pathname.includes('/admin/materials')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                                                />
                                            </svg>
                                            Gerenciar Materiais
                                        </ResponsiveNavLink>
                                    )}

                                    {canViewSuppliers() && (
                                        <ResponsiveNavLink
                                            href="/admin/suppliers"
                                            active={window.location.pathname.includes('/admin/suppliers')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                />
                                            </svg>
                                            Gerenciar Fornecedores
                                        </ResponsiveNavLink>
                                    )}

                                    {canViewInventory() && (
                                        <ResponsiveNavLink
                                            href="/admin/inventory"
                                            active={window.location.pathname.includes('/admin/inventory')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                                                />
                                            </svg>
                                            Transacoes de Estoque
                                        </ResponsiveNavLink>
                                    )}

                                    {isAdmin() && (
                                        <ResponsiveNavLink
                                            href="/admin/bom"
                                            active={window.location.pathname.includes('/admin/bom')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 12h6m-6 4h6"
                                                />
                                            </svg>
                                            Fichas Tecnicas (BOM)
                                        </ResponsiveNavLink>
                                    )}

                                    {isAdmin() && (
                                        <ResponsiveNavLink
                                            href="/admin/color-mapping"
                                            active={window.location.pathname.includes('/admin/color-mapping')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10c1.38 0 2.5-1.12 2.5-2.5 0-.61-.23-1.2-.64-1.67-.08-.1-.13-.21-.13-.33 0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9zm-5.5 9c-.83 0-1.5-.67-1.5-1.5S5.67 8 6.5 8 8 8.67 8 9.5 7.33 11 6.5 11zm3-4C8.67 7 8 6.33 8 5.5S8.67 4 9.5 4s1.5.67 1.5 1.5S10.33 7 9.5 7zm5 0c-.83 0-1.5-.67-1.5-1.5S13.67 4 14.5 4s1.5.67 1.5 1.5S15.33 7 14.5 7zm3 4c-.83 0-1.5-.67-1.5-1.5S16.67 8 17.5 8s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                                            </svg>
                                            Mapeamento de Cores
                                        </ResponsiveNavLink>
                                    )}

                                    {/* Permission Management Mobile Navigation - Admin Only */}
                                    {user.role === 'admin' && (
                                        <ResponsiveNavLink
                                            href="/admin/permissions"
                                            active={window.location.pathname.includes('/admin/permissions')}
                                            className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                        >
                                            <svg
                                                className="w-4 h-4 icon-hover"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                                />
                                            </svg>
                                            Gerenciar Permissoes
                                        </ResponsiveNavLink>
                                    )}
                                </>
                            )}
                        </div>

                        <div className="border-t border-gray-100 mx-4 py-4">
                            <div className="px-4 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="user-avatar w-12 h-12 text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-base font-semibold text-gray-800">
                                            {user.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {user.email}
                                        </div>
                                        <div className="text-xs role-badge mt-1">
                                            {user.role === "vendedora"
                                                ? "Vendedora BBKits"
                                                : user.role === "admin"
                                                ? "Administrador"
                                                : user.role === "finance_admin"
                                                ? "Financeiro Admin"
                                                : user.role === "production_admin"
                                                ? "Producao Admin"
                                                : "Financeiro"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <ResponsiveNavLink
                                    href="/profile"
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                        />
                                    </svg>
                                    Meu Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href="/logout"
                                    as="button"
                                    className="mobile-nav-item flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50 w-full text-left"
                                >
                                    <svg
                                        className="w-4 h-4 icon-hover"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                        />
                                    </svg>
                                    Sair
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </nav>

                {header && (
                    <header className="header-section mt-12 sm:mt-14 md:mt-15 lg:mt-16 border-b border-gray-100 relative z-10">
                        <div className="mx-auto max-w-7xl px-4 py-4 sm:py-5 md:py-6 sm:px-6 lg:px-8 relative z-10">
                            <div className="animate-fadeInUp">{header}</div>
                        </div>
                    </header>
                )}

                <main className="pt-12 sm:pt-14 md:pt-15 lg:pt-16 min-h-screen main-content">
                    <div className="animate-fadeInUp delay-200 relative z-10">
                        {children}
                    </div>
                </main>
            </div>
        </>
    );
}
