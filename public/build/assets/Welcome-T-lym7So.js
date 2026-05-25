import{r as o,j as e,Q as l,d as t}from"./app-De5o7I41.js";/* empty css            */function x({auth:n}){const[c,i]=o.useState(0),[d,s]=o.useState(!1);return o.useEffect(()=>{s(!0);const r=()=>i(window.scrollY);return window.addEventListener("scroll",r),()=>window.removeEventListener("scroll",r)},[]),e.jsxs(e.Fragment,{children:[e.jsx(l,{title:"BBKits - Sistema de Vendas"}),e.jsx("style",{children:`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');

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
                    --gradient-hero: linear-gradient(135deg, rgba(30, 58, 95, 0.97) 0%, rgba(71, 85, 105, 0.95) 100%);
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-gold: 0 0 40px rgba(212, 165, 116, 0.4);
                }

                * {
                    font-family: 'Inter', sans-serif;
                }

                .hero-gradient {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover fixed;
                    position: relative;
                }

                /* ========== PREMIUM ANIMATED BACKGROUND ========== */
                .animated-bg {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }

                /* Cosmic Aurora Effect */
                .aurora {
                    position: absolute;
                    width: 150%;
                    height: 150%;
                    top: -25%;
                    left: -25%;
                    background:
                        conic-gradient(from 0deg at 50% 50%,
                            transparent 0deg,
                            rgba(212, 165, 116, 0.1) 60deg,
                            transparent 120deg,
                            rgba(13, 148, 136, 0.08) 180deg,
                            transparent 240deg,
                            rgba(30, 58, 95, 0.1) 300deg,
                            transparent 360deg
                        );
                    animation: auroraRotate 40s linear infinite;
                    filter: blur(80px);
                }

                @keyframes auroraRotate {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                /* Morphing Blob Shapes */
                .morph-blob {
                    position: absolute;
                    filter: blur(80px);
                    opacity: 0.5;
                    animation: morphBlob 30s ease-in-out infinite;
                }

                .morph-blob-1 {
                    width: 600px;
                    height: 600px;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.35) 0%, transparent 70%);
                    top: -20%;
                    right: -20%;
                    animation-delay: 0s;
                }

                .morph-blob-2 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(13, 148, 136, 0.2) 0%, transparent 70%);
                    bottom: -15%;
                    left: -15%;
                    animation-delay: -10s;
                }

                .morph-blob-3 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(30, 58, 95, 0.3) 0%, transparent 70%);
                    top: 40%;
                    right: 10%;
                    animation-delay: -20s;
                }

                @keyframes morphBlob {
                    0%, 100% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                        transform: rotate(0deg) scale(1);
                    }
                    25% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                        transform: rotate(90deg) scale(1.1);
                    }
                    50% {
                        border-radius: 50% 60% 30% 60% / 30% 40% 70% 50%;
                        transform: rotate(180deg) scale(0.95);
                    }
                    75% {
                        border-radius: 40% 30% 60% 50% / 60% 70% 30% 40%;
                        transform: rotate(270deg) scale(1.05);
                    }
                }

                /* Floating Gold Diamonds */
                .diamond-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .diamond {
                    position: absolute;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.9), rgba(232, 196, 160, 0.5));
                    transform: rotate(45deg);
                    animation: diamondFloat 25s ease-in-out infinite;
                    box-shadow: 0 0 30px rgba(212, 165, 116, 0.6);
                }

                @keyframes diamondFloat {
                    0%, 100% {
                        transform: rotate(45deg) translateY(0) translateX(0);
                        opacity: 0;
                    }
                    5% { opacity: 0.9; }
                    95% { opacity: 0.9; }
                    100% {
                        transform: rotate(45deg) translateY(-150vh) translateX(80px);
                        opacity: 0;
                    }
                }

                /* Gold Sparkles */
                .sparkle-container {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .sparkle {
                    position: absolute;
                    background: radial-gradient(circle, rgba(212, 165, 116, 1) 0%, rgba(255, 255, 255, 0.8) 30%, transparent 70%);
                    border-radius: 50%;
                    animation: sparkleGlow 4s ease-in-out infinite;
                }

                @keyframes sparkleGlow {
                    0%, 100% {
                        transform: scale(0) rotate(0deg);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1) rotate(180deg);
                        opacity: 1;
                    }
                }

                /* Wave Animation at bottom */
                .wave-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 250px;
                    overflow: hidden;
                }

                .wave {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 200%;
                    height: 100%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.06' d='M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
                    animation: wave 20s linear infinite;
                }

                .wave-2 {
                    bottom: 15px;
                    opacity: 0.5;
                    animation: wave 18s linear reverse infinite;
                    animation-delay: -5s;
                }

                .wave-3 {
                    bottom: 30px;
                    opacity: 0.3;
                    animation: wave 25s linear infinite;
                    animation-delay: -10s;
                }

                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }

                /* Elegant Flowing Lines */
                .flow-lines {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                .flow-line {
                    position: absolute;
                    width: 300px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.6), transparent);
                    animation: flowMove 15s linear infinite;
                    transform-origin: center;
                }

                @keyframes flowMove {
                    0% {
                        transform: translateX(-300px) translateY(0) rotate(-25deg);
                        opacity: 0;
                    }
                    10% { opacity: 0.7; }
                    90% { opacity: 0.7; }
                    100% {
                        transform: translateX(calc(100vw + 300px)) translateY(-40vh) rotate(-25deg);
                        opacity: 0;
                    }
                }

                /* Geometric Pattern Overlay */
                .geo-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0.02;
                    background-image:
                        linear-gradient(30deg, var(--accent-color) 12%, transparent 12.5%, transparent 87%, var(--accent-color) 87.5%, var(--accent-color)),
                        linear-gradient(150deg, var(--accent-color) 12%, transparent 12.5%, transparent 87%, var(--accent-color) 87.5%, var(--accent-color)),
                        linear-gradient(30deg, var(--accent-color) 12%, transparent 12.5%, transparent 87%, var(--accent-color) 87.5%, var(--accent-color)),
                        linear-gradient(150deg, var(--accent-color) 12%, transparent 12.5%, transparent 87%, var(--accent-color) 87.5%, var(--accent-color));
                    background-size: 80px 140px;
                    background-position: 0 0, 0 0, 40px 70px, 40px 70px;
                    animation: patternMove 120s linear infinite;
                }

                @keyframes patternMove {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(80px, 140px); }
                }

                /* ========== NAVBAR ANIMATIONS ========== */
                .navbar-clean {
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(45, 74, 111, 0.92) 100%);
                    backdrop-filter: blur(24px);
                    border-radius: 20px;
                    box-shadow:
                        0 8px 32px rgba(30, 58, 95, 0.35),
                        0 2px 8px rgba(0, 0, 0, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(212, 165, 116, 0.2);
                    position: relative;
                    overflow: hidden;
                    transform: translateY(-30px);
                    opacity: 0;
                    animation: navbarEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: 0.2s;
                }

                @keyframes navbarEntrance {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .navbar-clean::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.6), transparent);
                }

                .navbar-clean::after {
                    content: '';
                    position: absolute;
                    bottom: 0;
                    left: 10%;
                    right: 10%;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.3), transparent);
                    border-radius: 2px;
                }

                /* ========== LOGO ANIMATION ========== */
                .logo-container {
                    background: rgba(255, 255, 255, 0.12);
                    padding: 10px 16px;
                    border-radius: 14px;
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.15),
                        0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    position: relative;
                    overflow: hidden;
                }

                .logo-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.3) 0%, transparent 50%);
                    animation: logoGlow 4s ease-in-out infinite;
                    opacity: 0;
                }

                @keyframes logoGlow {
                    0%, 100% { opacity: 0; transform: scale(0.8) rotate(0deg); }
                    50% { opacity: 1; transform: scale(1) rotate(180deg); }
                }

                .logo-container:hover {
                    transform: translateY(-3px) scale(1.03);
                    background: rgba(255, 255, 255, 0.2);
                    box-shadow:
                        inset 0 1px 0 rgba(255, 255, 255, 0.25),
                        0 8px 24px rgba(0, 0, 0, 0.2),
                        var(--shadow-gold);
                    border-color: rgba(212, 165, 116, 0.5);
                }

                .logo-container:hover::before {
                    animation-duration: 2s;
                }

                .logo-container img {
                    filter: brightness(1.1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                    transition: transform 0.4s ease;
                }

                .logo-container:hover img {
                    transform: scale(1.08);
                }

                /* ========== BUTTON ANIMATIONS ========== */
                .btn-primary {
                    background: var(--gradient);
                    color: white;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--shadow);
                }

                .btn-primary::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.6s ease;
                }

                .btn-primary:hover::before {
                    left: 100%;
                }

                .btn-primary:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow:
                        0 12px 24px -4px rgba(30, 58, 95, 0.4),
                        var(--shadow-gold);
                }

                .btn-accent {
                    background: var(--gradient-accent);
                    color: var(--primary-dark);
                    font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 16px rgba(212, 165, 116, 0.35);
                    position: relative;
                    overflow: hidden;
                }

                .btn-accent::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.6s ease;
                }

                .btn-accent:hover::before {
                    left: 100%;
                }

                .btn-accent:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow:
                        0 8px 28px rgba(212, 165, 116, 0.5),
                        0 0 0 2px rgba(255, 255, 255, 0.2);
                }

                .btn-outline {
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.35);
                    color: white;
                    backdrop-filter: blur(10px);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .btn-outline::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: white;
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.4s ease;
                    z-index: -1;
                }

                .btn-outline:hover::before {
                    transform: scaleX(1);
                }

                .btn-outline:hover {
                    color: var(--primary-dark);
                    border-color: white;
                    transform: translateY(-3px);
                    box-shadow: 0 8px 24px rgba(255, 255, 255, 0.2);
                }

                .btn-login {
                    background: transparent;
                    color: var(--primary-color);
                    border: 2px solid var(--primary-color);
                    font-weight: 600;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .btn-login::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: var(--gradient);
                    transform: scaleY(0);
                    transform-origin: bottom;
                    transition: transform 0.4s ease;
                    z-index: -1;
                }

                .btn-login:hover::before {
                    transform: scaleY(1);
                }

                .btn-login:hover {
                    color: white;
                    border-color: var(--primary-color);
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-md);
                }

                .btn-register {
                    background: var(--gradient-accent);
                    color: var(--primary-dark);
                    font-weight: 700;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(212, 165, 116, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .btn-register::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                    transition: left 0.5s ease;
                }

                .btn-register:hover::before {
                    left: 100%;
                }

                .btn-register:hover {
                    transform: translateY(-2px) scale(1.03);
                    box-shadow:
                        0 8px 24px rgba(212, 165, 116, 0.5),
                        var(--shadow-gold);
                }

                /* ========== HERO SECTION ANIMATIONS ========== */
                .hero-title {
                    opacity: 0;
                    transform: translateY(50px);
                    animation: heroTitleReveal 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: 0.4s;
                }

                @keyframes heroTitleReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-title-main {
                    display: inline-block;
                    background: linear-gradient(135deg, #FFFFFF 0%, #E8C4A0 50%, #D4A574 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 200% auto;
                    animation: heroTextShimmer 5s ease-in-out infinite;
                    animation-delay: 1.5s;
                    text-shadow: none;
                }

                @keyframes heroTextShimmer {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                }

                .hero-subtitle-line {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: heroSubtitleReveal 0.8s ease-out forwards;
                    animation-delay: 0.7s;
                }

                @keyframes heroSubtitleReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-description {
                    opacity: 0;
                    transform: translateY(25px);
                    animation: heroDescReveal 0.8s ease-out forwards;
                    animation-delay: 0.9s;
                }

                @keyframes heroDescReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .hero-buttons {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: heroButtonsReveal 0.8s ease-out forwards;
                    animation-delay: 1.1s;
                }

                @keyframes heroButtonsReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Hero Icons Animation */
                .hero-icons {
                    opacity: 0;
                    animation: heroIconsReveal 0.8s ease-out forwards;
                    animation-delay: 1.3s;
                }

                @keyframes heroIconsReveal {
                    to { opacity: 1; }
                }

                .icon-circle {
                    width: 60px;
                    height: 60px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    position: relative;
                    overflow: hidden;
                }

                .icon-circle::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.3), transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .icon-circle:hover::before {
                    opacity: 1;
                }

                .icon-circle:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-5px) scale(1.1);
                    border-color: rgba(212, 165, 116, 0.5);
                    box-shadow: var(--shadow-gold);
                }

                .icon-circle:nth-child(1) {
                    animation: iconBounce 3s ease-in-out infinite;
                    animation-delay: 1.5s;
                }

                .icon-circle:nth-child(2) {
                    animation: iconBounce 3s ease-in-out infinite;
                    animation-delay: 1.7s;
                }

                .icon-circle:nth-child(3) {
                    animation: iconBounce 3s ease-in-out infinite;
                    animation-delay: 1.9s;
                }

                @keyframes iconBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-8px); }
                }

                /* ========== FEATURE CARDS ANIMATIONS ========== */
                .features-section {
                    position: relative;
                    overflow: hidden;
                }

                .features-section::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 200px;
                    background: linear-gradient(to bottom, rgba(30, 58, 95, 0.03), transparent);
                    pointer-events: none;
                }

                .section-title {
                    opacity: 0;
                    transform: translateY(30px);
                    animation: sectionTitleReveal 0.8s ease-out forwards;
                }

                .section-title.visible {
                    animation-play-state: running;
                }

                @keyframes sectionTitleReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .card-clean {
                    background: white;
                    border-radius: 20px;
                    box-shadow:
                        0 4px 24px rgba(0, 0, 0, 0.06),
                        0 1px 3px rgba(0, 0, 0, 0.04);
                    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0, 0, 0, 0.04);
                    position: relative;
                    overflow: hidden;
                    opacity: 0;
                    transform: translateY(40px);
                    animation: cardReveal 0.8s ease-out forwards;
                }

                .card-clean:nth-child(1) { animation-delay: 0.2s; }
                .card-clean:nth-child(2) { animation-delay: 0.4s; }
                .card-clean:nth-child(3) { animation-delay: 0.6s; }

                @keyframes cardReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .card-clean::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: var(--gradient);
                    transform: scaleX(0);
                    transform-origin: left;
                    transition: transform 0.4s ease;
                }

                .card-clean:hover::before {
                    transform: scaleX(1);
                }

                .card-clean::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.05), transparent);
                    transition: left 0.6s ease;
                }

                .card-clean:hover::after {
                    left: 100%;
                }

                .card-clean:hover {
                    transform: translateY(-12px);
                    box-shadow:
                        0 24px 48px -12px rgba(0, 0, 0, 0.12),
                        0 8px 16px rgba(212, 165, 116, 0.08);
                    border-color: rgba(212, 165, 116, 0.2);
                }

                .feature-icon {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: 0 4px 12px rgba(30, 58, 95, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .feature-icon::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 50%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }

                .card-clean:hover .feature-icon::before {
                    opacity: 1;
                    animation: iconGlow 1.5s ease-in-out infinite;
                }

                @keyframes iconGlow {
                    0%, 100% { transform: scale(0.8) rotate(0deg); }
                    50% { transform: scale(1) rotate(180deg); }
                }

                .card-clean:hover .feature-icon {
                    transform: scale(1.15) rotate(5deg);
                    box-shadow:
                        0 8px 24px rgba(30, 58, 95, 0.4),
                        var(--shadow-gold);
                }

                /* ========== QUOTE SECTION ========== */
                .quote-section {
                    background: var(--gradient);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                    transform: translateY(40px);
                    opacity: 0;
                    animation: quoteReveal 0.8s ease-out forwards;
                    animation-delay: 0.8s;
                }

                @keyframes quoteReveal {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .quote-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -30%;
                    width: 80%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.25) 0%, transparent 60%);
                    pointer-events: none;
                    animation: quoteBgMove 20s ease-in-out infinite;
                }

                @keyframes quoteBgMove {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    50% { transform: translate(-20px, 20px) rotate(10deg); }
                }

                .quote-section::after {
                    content: '"';
                    position: absolute;
                    top: -20px;
                    left: 30px;
                    font-size: 150px;
                    font-weight: 900;
                    color: rgba(255, 255, 255, 0.05);
                    line-height: 1;
                    pointer-events: none;
                }

                .quote-text {
                    position: relative;
                    z-index: 1;
                }

                .gold-accent {
                    color: var(--accent-color);
                    animation: goldPulse 3s ease-in-out infinite;
                }

                @keyframes goldPulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.7; }
                }

                /* ========== SCROLL INDICATOR ========== */
                .scroll-indicator {
                    position: absolute;
                    bottom: 40px;
                    left: 50%;
                    transform: translateX(-50%);
                    opacity: 0;
                    animation: scrollIndicatorReveal 0.8s ease-out forwards, scrollBounce 2s ease-in-out infinite;
                    animation-delay: 1.8s, 2.6s;
                }

                @keyframes scrollIndicatorReveal {
                    to { opacity: 1; }
                }

                @keyframes scrollBounce {
                    0%, 100% { transform: translateX(-50%) translateY(0); }
                    50% { transform: translateX(-50%) translateY(10px); }
                }

                .scroll-indicator-inner {
                    width: 28px;
                    height: 44px;
                    border: 2px solid rgba(255, 255, 255, 0.4);
                    border-radius: 14px;
                    position: relative;
                }

                .scroll-indicator-dot {
                    position: absolute;
                    top: 8px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.8);
                    border-radius: 2px;
                    animation: scrollDot 1.5s ease-in-out infinite;
                }

                @keyframes scrollDot {
                    0%, 100% { top: 8px; opacity: 1; }
                    50% { top: 24px; opacity: 0.3; }
                }

                /* ========== RESPONSIVE ========== */
                @media (max-width: 768px) {
                    .hero-title-main {
                        font-size: 2.5rem !important;
                    }

                    .hero-subtitle-line {
                        font-size: 1.25rem !important;
                    }

                    .morph-blob {
                        transform: scale(0.6);
                    }

                    .card-clean {
                        margin-bottom: 16px;
                    }
                }
            `}),e.jsxs("div",{className:"min-h-screen hero-gradient relative overflow-hidden",children:[e.jsxs("div",{className:"animated-bg",children:[e.jsx("div",{className:"aurora"}),e.jsx("div",{className:"geo-pattern"}),e.jsx("div",{className:"morph-blob morph-blob-1"}),e.jsx("div",{className:"morph-blob morph-blob-2"}),e.jsx("div",{className:"morph-blob morph-blob-3"}),e.jsxs("div",{className:"wave-container",children:[e.jsx("div",{className:"wave"}),e.jsx("div",{className:"wave wave-2"}),e.jsx("div",{className:"wave wave-3"})]}),e.jsx("div",{className:"diamond-container",children:Array.from({length:12},(r,a)=>e.jsx("div",{className:"diamond",style:{left:`${5+a*8}%`,top:`${100+Math.random()*20}%`,animationDelay:`${a*2}s`,animationDuration:`${20+Math.random()*10}s`,width:`${8+Math.random()*12}px`,height:`${8+Math.random()*12}px`}},`diamond-${a}`))}),e.jsx("div",{className:"sparkle-container",children:Array.from({length:40},(r,a)=>e.jsx("div",{className:"sparkle",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*4}s`,animationDuration:`${3+Math.random()*3}s`,width:`${3+Math.random()*5}px`,height:`${3+Math.random()*5}px`}},`sparkle-${a}`))}),e.jsx("div",{className:"flow-lines",children:Array.from({length:8},(r,a)=>e.jsx("div",{className:"flow-line",style:{top:`${10+a*12}%`,animationDelay:`${a*2}s`,animationDuration:`${12+a*2}s`,width:`${200+Math.random()*150}px`}},`flow-${a}`))})]}),e.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[e.jsxs("nav",{className:"navbar-clean flex items-center justify-between mb-16 px-8 py-5",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(t,{href:"/",className:"logo-container",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-10 w-auto object-contain"})})}),e.jsx("div",{className:"flex items-center space-x-4",children:n.user?e.jsx(t,{href:"/dashboard",className:"btn-primary text-white px-8 py-3 rounded-xl font-semibold text-base tracking-wide",children:"Acessar Sistema"}):e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(t,{href:"/login",className:"btn-login px-6 py-2.5 rounded-xl text-sm",children:"Entrar"}),e.jsx(t,{href:"/register",className:"btn-register px-6 py-2.5 rounded-xl text-sm",children:"Cadastrar"})]})})]}),e.jsxs("div",{className:"text-center max-w-4xl mx-auto text-white pt-8 pb-24",children:[e.jsxs("h1",{className:"hero-title mb-6 leading-tight",children:[e.jsx("span",{className:"hero-title-main text-5xl md:text-6xl lg:text-7xl font-black",children:"BBkits"}),e.jsx("span",{className:"hero-subtitle-line block text-3xl md:text-4xl lg:text-5xl mt-4 font-medium text-white/90",children:"Sistema de Vendas Premium"})]}),e.jsx("p",{className:"hero-description text-lg md:text-xl mb-12 leading-relaxed text-white/85 max-w-2xl mx-auto font-light",children:"Plataforma completa para gestao de vendas, controle de comissoes e acompanhamento de metas para vendedoras de bolsas maternidade premium"}),!n.user&&e.jsxs("div",{className:"hero-buttons flex flex-col sm:flex-row gap-4 justify-center mb-16",children:[e.jsx(t,{href:"/login",className:"btn-outline px-8 py-4 rounded-xl text-lg font-semibold",children:"Fazer Login"}),e.jsx(t,{href:"/register",className:"btn-accent px-8 py-4 rounded-xl text-lg font-bold",children:"Quero ser uma vendedora BBkits"})]}),e.jsxs("div",{className:"hero-icons flex justify-center gap-6 mb-8",children:[e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"})})}),e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})})}),e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"})})})]})]}),e.jsx("div",{className:"scroll-indicator",children:e.jsx("div",{className:"scroll-indicator-inner",children:e.jsx("div",{className:"scroll-indicator-dot"})})})]}),e.jsx("div",{className:"features-section bg-white/98 backdrop-blur-sm",children:e.jsxs("div",{className:"container mx-auto px-4 py-20",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h2",{className:"section-title text-3xl md:text-4xl font-bold text-gray-900 mb-4",children:"Como Funciona o Sistema"}),e.jsx("p",{className:"text-lg text-gray-600 max-w-2xl mx-auto",children:"Um processo simples e transparente para o seu sucesso"})]}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-8 mt-12",children:[e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Controle de Vendas"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Registre suas vendas com comprovantes e acompanhe o status de aprovacao em tempo real atraves do seu painel personalizado."})]}),e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Calculo de Comissoes"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Sistema automatico de calculo de comissoes baseado em metas e valores recebidos com transparencia total."})]}),e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Dashboard Motivacional"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Acompanhe seu progresso, ranking e metas com interface gamificada e motivacional que impulsiona seu sucesso."})]})]}),e.jsxs("div",{className:"mt-20 quote-section p-12 text-white text-center",children:[e.jsx("h2",{className:"quote-text text-2xl md:text-3xl font-bold mb-6",children:'"Voce nao vende bolsas. Voce entrega historias, seguranca e amor."'}),e.jsxs("div",{className:"flex justify-center items-center gap-4 text-2xl mb-4",children:[e.jsx("span",{className:"gold-accent",children:e.jsx("svg",{className:"w-6 h-6 inline",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"})})}),e.jsx("span",{children:"💼"}),e.jsx("span",{children:"👶"}),e.jsx("span",{className:"gold-accent",children:e.jsx("svg",{className:"w-6 h-6 inline",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})})})]}),e.jsx("p",{className:"text-white/90 text-lg font-medium",children:"Sistema desenvolvido especialmente para as vendedoras BBKits"})]})]})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{x as default};
