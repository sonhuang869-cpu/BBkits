import{j as e,Q as s,d as t}from"./app-4EpxxEbX.js";/* empty css            */function l({auth:r}){return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"BBKits - Sistema de Vendas"}),e.jsx("style",{children:`
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
                    --gradient-hero: linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(71, 85, 105, 0.90) 100%);
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-gold: 0 0 20px rgba(212, 165, 116, 0.3);
                }

                * {
                    font-family: 'Inter', sans-serif;
                }

                .hero-gradient {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                }

                .hero-gradient::before {
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

                .btn-primary {
                    background: var(--gradient);
                    color: white;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
                    transition: left 0.5s;
                }

                .btn-primary:hover::before {
                    left: 100%;
                }

                .btn-primary:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-lg);
                }

                .btn-accent {
                    background: var(--gradient-accent);
                    color: var(--primary-dark);
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    box-shadow: var(--shadow);
                }

                .btn-accent:hover {
                    transform: translateY(-2px);
                    box-shadow: var(--shadow-gold);
                }

                .btn-outline {
                    background: transparent;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    color: white;
                    backdrop-filter: blur(10px);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .btn-outline:hover {
                    background: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.5);
                    transform: translateY(-2px);
                }

                .card-clean {
                    background: white;
                    border-radius: 16px;
                    box-shadow: var(--shadow);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                }

                .card-clean:hover {
                    transform: translateY(-8px);
                    box-shadow: var(--shadow-lg);
                    border-color: var(--accent-color);
                }

                .feature-icon {
                    background: var(--gradient);
                    transition: all 0.3s ease;
                    box-shadow: var(--shadow);
                }

                .feature-icon:hover {
                    transform: scale(1.1);
                    box-shadow: var(--shadow-md);
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
                        radial-gradient(ellipse 50% 60% at 40% 80%, rgba(30, 58, 95, 0.12) 0%, transparent 50%),
                        radial-gradient(ellipse 70% 40% at 70% 60%, rgba(212, 165, 116, 0.08) 0%, transparent 50%);
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
                    width: 400px;
                    height: 400px;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.3) 0%, rgba(232, 196, 160, 0.1) 100%);
                    top: -10%;
                    right: -10%;
                    animation-delay: 0s;
                }

                .orb-2 {
                    width: 300px;
                    height: 300px;
                    background: linear-gradient(135deg, rgba(13, 148, 136, 0.2) 0%, rgba(30, 58, 95, 0.15) 100%);
                    bottom: 10%;
                    left: -5%;
                    animation-delay: -7s;
                }

                .orb-3 {
                    width: 250px;
                    height: 250px;
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.25) 0%, rgba(71, 85, 105, 0.1) 100%);
                    top: 40%;
                    right: 20%;
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

                /* Wave Animation */
                .wave-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    height: 200px;
                    overflow: hidden;
                }

                .wave {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 200%;
                    height: 100%;
                    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.05' d='M0,160L48,176C96,192,192,224,288,213.3C384,203,480,149,576,133.3C672,117,768,139,864,165.3C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E") repeat-x;
                    animation: wave 25s linear infinite;
                }

                .wave-2 {
                    bottom: 10px;
                    opacity: 0.5;
                    animation: wave 20s linear reverse infinite;
                    animation-delay: -5s;
                }

                .wave-3 {
                    bottom: 20px;
                    opacity: 0.3;
                    animation: wave 30s linear infinite;
                    animation-delay: -10s;
                }

                @keyframes wave {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
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

                .hero-title {
                    animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(30px);
                }

                .hero-subtitle {
                    animation: fadeInUp 0.8s 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }

                .hero-buttons {
                    animation: fadeInUp 0.8s 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
                    opacity: 0;
                    transform: translateY(20px);
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .quote-section {
                    background: var(--gradient);
                    border-radius: 20px;
                    position: relative;
                    overflow: hidden;
                }

                .quote-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 60%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.2) 0%, transparent 70%);
                    pointer-events: none;
                }

                .navbar-clean {
                    background: linear-gradient(135deg, rgba(30, 58, 95, 0.95) 0%, rgba(45, 74, 111, 0.92) 100%);
                    backdrop-filter: blur(20px);
                    border-radius: 20px;
                    box-shadow: 0 8px 32px rgba(30, 58, 95, 0.35), 0 2px 8px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(212, 165, 116, 0.2);
                    position: relative;
                    overflow: hidden;
                }

                .navbar-clean::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.5), transparent);
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

                .logo-container {
                    background: rgba(255, 255, 255, 0.12);
                    padding: 10px 16px;
                    border-radius: 14px;
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                }

                .logo-container:hover {
                    transform: translateY(-2px);
                    background: rgba(255, 255, 255, 0.18);
                    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 4px 16px rgba(0, 0, 0, 0.15);
                    border-color: rgba(212, 165, 116, 0.4);
                }

                .logo-container img {
                    filter: brightness(1.1) drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
                }

                .btn-login {
                    background: transparent;
                    color: var(--primary-color);
                    border: 2px solid var(--primary-color);
                    font-weight: 600;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                }

                .btn-login::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(30, 58, 95, 0.05), transparent);
                    transition: left 0.5s;
                }

                .btn-login:hover::before {
                    left: 100%;
                }

                .btn-login:hover {
                    background: var(--primary-color);
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: var(--shadow);
                }

                .btn-register {
                    background: var(--gradient-accent);
                    color: var(--primary-dark);
                    font-weight: 700;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
                    transition: left 0.5s;
                }

                .btn-register:hover::before {
                    left: 100%;
                }

                .btn-register:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(212, 165, 116, 0.45);
                }

                .gold-accent {
                    color: var(--accent-color);
                }

                .icon-circle {
                    width: 56px;
                    height: 56px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                }

                .icon-circle:hover {
                    background: rgba(255, 255, 255, 0.2);
                    transform: scale(1.1);
                    border-color: rgba(255, 255, 255, 0.4);
                }
            `}),e.jsxs("div",{className:"min-h-screen hero-gradient relative overflow-hidden",children:[e.jsxs("div",{className:"animated-bg",children:[e.jsx("div",{className:"gradient-mesh"}),e.jsx("div",{className:"orb orb-1"}),e.jsx("div",{className:"orb orb-2"}),e.jsx("div",{className:"orb orb-3"}),e.jsxs("div",{className:"wave-container",children:[e.jsx("div",{className:"wave"}),e.jsx("div",{className:"wave wave-2"}),e.jsx("div",{className:"wave wave-3"})]}),e.jsx("div",{className:"particles",children:Array.from({length:20},(o,a)=>e.jsx("div",{className:"particle",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*15}s`,animationDuration:`${Math.random()*10+10}s`,width:`${Math.random()*4+2}px`,height:`${Math.random()*4+2}px`}},a))}),e.jsx("div",{className:"glow-lines",children:Array.from({length:5},(o,a)=>e.jsx("div",{className:"glow-line",style:{left:`${20+a*15}%`,animationDelay:`${a*1.5}s`,animationDuration:`${6+a}s`}},a))})]}),e.jsxs("div",{className:"container mx-auto px-4 py-8 relative z-10",children:[e.jsxs("nav",{className:"navbar-clean flex items-center justify-between mb-16 px-8 py-5",children:[e.jsx("div",{className:"flex items-center",children:e.jsx(t,{href:"/",className:"logo-container",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-10 w-auto object-contain"})})}),e.jsx("div",{className:"flex items-center space-x-4",children:r.user?e.jsx(t,{href:"/dashboard",className:"btn-primary text-white px-8 py-3 rounded-xl font-semibold text-base tracking-wide",children:"Acessar Sistema"}):e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx(t,{href:"/login",className:"btn-login px-6 py-2.5 rounded-xl text-sm",children:"Entrar"}),e.jsx(t,{href:"/register",className:"btn-register px-6 py-2.5 rounded-xl text-sm",children:"Cadastrar"})]})})]}),e.jsxs("div",{className:"text-center max-w-4xl mx-auto text-white pt-8 pb-16",children:[e.jsxs("h1",{className:"text-5xl md:text-6xl lg:text-7xl font-bold mb-6 hero-title leading-tight",children:["BBkits",e.jsx("span",{className:"block text-3xl md:text-4xl lg:text-5xl mt-4 font-medium text-white/90",children:"Sistema de Vendas Premium"})]}),e.jsx("p",{className:"text-lg md:text-xl mb-12 leading-relaxed text-white/85 hero-subtitle max-w-2xl mx-auto font-light",children:"Plataforma completa para gestao de vendas, controle de comissoes e acompanhamento de metas para vendedoras de bolsas maternidade premium"}),!r.user&&e.jsxs("div",{className:"flex flex-col sm:flex-row gap-4 justify-center mb-16 hero-buttons",children:[e.jsx(t,{href:"/login",className:"btn-outline px-8 py-4 rounded-xl text-lg font-semibold",children:"Fazer Login"}),e.jsx(t,{href:"/register",className:"btn-accent px-8 py-4 rounded-xl text-lg font-bold",children:"Quero ser uma vendedora BBkits"})]}),e.jsxs("div",{className:"flex justify-center gap-6 mb-8",children:[e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"})})}),e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})})}),e.jsx("div",{className:"icon-circle text-xl text-white",children:e.jsx("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .55-.45 1-1 1H6c-.55 0-1-.45-1-1v-1h14v1z"})})})]})]})]}),e.jsx("div",{className:"bg-white/98 backdrop-blur-sm",children:e.jsxs("div",{className:"container mx-auto px-4 py-20",children:[e.jsxs("div",{className:"text-center mb-16",children:[e.jsx("h2",{className:"text-3xl md:text-4xl font-bold text-gray-900 mb-4",children:"Como Funciona o Sistema"}),e.jsx("p",{className:"text-lg text-gray-600 max-w-2xl mx-auto",children:"Um processo simples e transparente para o seu sucesso"})]}),e.jsxs("div",{className:"grid md:grid-cols-3 gap-8 mt-12",children:[e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Controle de Vendas"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Registre suas vendas com comprovantes e acompanhe o status de aprovacao em tempo real atraves do seu painel personalizado."})]}),e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Calculo de Comissoes"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Sistema automatico de calculo de comissoes baseado em metas e valores recebidos com transparencia total."})]}),e.jsxs("div",{className:"card-clean p-8 text-center group",children:[e.jsx("div",{className:"w-16 h-16 feature-icon rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition duration-300",children:e.jsx("svg",{className:"w-8 h-8 text-white",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"})})}),e.jsx("h3",{className:"text-xl font-bold text-gray-900 mb-3",children:"Dashboard Motivacional"}),e.jsx("p",{className:"text-gray-600 leading-relaxed",children:"Acompanhe seu progresso, ranking e metas com interface gamificada e motivacional que impulsiona seu sucesso."})]})]}),e.jsxs("div",{className:"mt-20 quote-section p-12 text-white text-center relative z-10",children:[e.jsx("h2",{className:"text-2xl md:text-3xl font-bold mb-6 relative z-10",children:'"Voce nao vende bolsas. Voce entrega historias, seguranca e amor."'}),e.jsxs("div",{className:"flex justify-center items-center gap-4 text-2xl mb-4 relative z-10",children:[e.jsx("span",{className:"gold-accent",children:e.jsx("svg",{className:"w-6 h-6 inline",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"})})}),e.jsx("span",{children:"💼"}),e.jsx("span",{children:"👶"}),e.jsx("span",{className:"gold-accent",children:e.jsx("svg",{className:"w-6 h-6 inline",fill:"currentColor",viewBox:"0 0 24 24",children:e.jsx("path",{d:"M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"})})})]}),e.jsx("p",{className:"text-white/90 text-lg font-medium relative z-10",children:"Sistema desenvolvido especialmente para as vendedoras BBKits"})]})]})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{l as default};
