import{x as g,r as d,V as o,j as a,Q as f,d as l}from"./app-De5o7I41.js";import"./TextInput-D_NKmAM2.js";/* empty css            */function v({status:i,canResetPassword:p}){const{data:n,setData:s,post:m,processing:c,errors:r,reset:h}=g({email:"",password:"",remember:!1}),[u,b]=d.useState(!1);d.useEffect(()=>{b(!0),i&&o.success(i)},[i]);const x=t=>{t.preventDefault(),m("/login",{onFinish:()=>h("password"),onSuccess:()=>{o.success("Login realizado com sucesso!")},onError:e=>{e.email&&o.error(e.email),e.password&&o.error(e.password)}})};return a.jsxs(a.Fragment,{children:[a.jsx(f,{title:"Entrar - BBKits"}),a.jsx("style",{children:`
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
                    --gradient-hero: linear-gradient(135deg, rgba(30, 58, 95, 0.97) 0%, rgba(71, 85, 105, 0.95) 100%);
                    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
                    --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                    --shadow-md: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
                    --shadow-lg: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                    --shadow-xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    --shadow-gold: 0 0 40px rgba(212, 165, 116, 0.4);
                }

                * {
                    font-family: 'Inter', sans-serif;
                }

                .login-bg {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
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

                /* Aurora Borealis Effect */
                .aurora {
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background:
                        linear-gradient(45deg, transparent 40%, rgba(212, 165, 116, 0.08) 50%, transparent 60%),
                        linear-gradient(-45deg, transparent 40%, rgba(13, 148, 136, 0.06) 50%, transparent 60%);
                    animation: auroraShift 15s ease-in-out infinite;
                    filter: blur(60px);
                }

                @keyframes auroraShift {
                    0%, 100% { transform: translateX(-10%) rotate(0deg); opacity: 0.5; }
                    33% { transform: translateX(10%) rotate(3deg); opacity: 0.8; }
                    66% { transform: translateX(-5%) rotate(-2deg); opacity: 0.6; }
                }

                /* Morphing Blob Shapes */
                .morph-blob {
                    position: absolute;
                    filter: blur(60px);
                    opacity: 0.4;
                    animation: morphBlob 25s ease-in-out infinite;
                }

                .morph-blob-1 {
                    width: 500px;
                    height: 500px;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.4) 0%, transparent 70%);
                    top: -15%;
                    right: -15%;
                    animation-delay: 0s;
                }

                .morph-blob-2 {
                    width: 400px;
                    height: 400px;
                    background: radial-gradient(circle, rgba(13, 148, 136, 0.25) 0%, transparent 70%);
                    bottom: -10%;
                    left: -10%;
                    animation-delay: -8s;
                }

                .morph-blob-3 {
                    width: 300px;
                    height: 300px;
                    background: radial-gradient(circle, rgba(30, 58, 95, 0.35) 0%, transparent 70%);
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    animation-delay: -16s;
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
                    width: 12px;
                    height: 12px;
                    background: linear-gradient(135deg, rgba(212, 165, 116, 0.8), rgba(232, 196, 160, 0.4));
                    transform: rotate(45deg);
                    animation: diamondFloat 20s ease-in-out infinite;
                    box-shadow: 0 0 20px rgba(212, 165, 116, 0.5);
                }

                @keyframes diamondFloat {
                    0%, 100% {
                        transform: rotate(45deg) translateY(0) translateX(0);
                        opacity: 0;
                    }
                    10% { opacity: 0.8; }
                    90% { opacity: 0.8; }
                    100% {
                        transform: rotate(45deg) translateY(-120vh) translateX(100px);
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
                    width: 4px;
                    height: 4px;
                    background: radial-gradient(circle, rgba(212, 165, 116, 1) 0%, transparent 70%);
                    border-radius: 50%;
                    animation: sparkleGlow 3s ease-in-out infinite;
                }

                @keyframes sparkleGlow {
                    0%, 100% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    50% {
                        transform: scale(1);
                        opacity: 1;
                    }
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
                    width: 200px;
                    height: 2px;
                    background: linear-gradient(90deg, transparent, rgba(212, 165, 116, 0.5), transparent);
                    animation: flowMove 12s linear infinite;
                    transform-origin: center;
                }

                @keyframes flowMove {
                    0% {
                        transform: translateX(-200px) translateY(0) rotate(-30deg);
                        opacity: 0;
                    }
                    10% { opacity: 0.6; }
                    90% { opacity: 0.6; }
                    100% {
                        transform: translateX(calc(100vw + 200px)) translateY(-50vh) rotate(-30deg);
                        opacity: 0;
                    }
                }

                /* ========== FORM CARD ANIMATIONS ========== */
                .form-card {
                    background: rgba(255, 255, 255, 0.98);
                    backdrop-filter: blur(24px);
                    border-radius: 24px;
                    box-shadow:
                        0 32px 64px -12px rgba(0, 0, 0, 0.2),
                        0 0 0 1px rgba(255, 255, 255, 0.1),
                        inset 0 1px 0 rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(212, 165, 116, 0.15);
                    position: relative;
                    overflow: hidden;
                    transform: translateY(60px) rotateX(10deg);
                    opacity: 0;
                    animation: cardEntrance 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                    animation-delay: 0.2s;
                    perspective: 1000px;
                }

                @keyframes cardEntrance {
                    to {
                        transform: translateY(0) rotateX(0);
                        opacity: 1;
                    }
                }

                .form-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(
                        90deg,
                        transparent,
                        rgba(212, 165, 116, 0.08),
                        transparent
                    );
                    animation: cardShimmer 4s ease-in-out infinite;
                    animation-delay: 1s;
                }

                @keyframes cardShimmer {
                    0% { left: -100%; }
                    50%, 100% { left: 100%; }
                }

                /* Gold accent line on card */
                .form-card::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 60%;
                    height: 3px;
                    background: linear-gradient(90deg, transparent, var(--accent-color), transparent);
                    border-radius: 0 0 4px 4px;
                }

                /* ========== FORM TITLE ANIMATION ========== */
                .form-title {
                    background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 50%, #D4A574 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    background-size: 200% auto;
                    animation: titleShimmer 4s ease-in-out infinite;
                    transform: translateY(20px);
                    opacity: 0;
                    animation: titleReveal 0.6s ease-out forwards, titleShimmer 4s ease-in-out infinite;
                    animation-delay: 0.5s, 1.1s;
                }

                @keyframes titleReveal {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                @keyframes titleShimmer {
                    0%, 100% { background-position: 0% center; }
                    50% { background-position: 100% center; }
                }

                .form-subtitle {
                    opacity: 0;
                    transform: translateY(15px);
                    animation: subtitleReveal 0.6s ease-out forwards;
                    animation-delay: 0.7s;
                }

                @keyframes subtitleReveal {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* ========== INPUT FIELD ANIMATIONS ========== */
                .input-group {
                    position: relative;
                    opacity: 0;
                    transform: translateX(-30px);
                    animation: inputSlideIn 0.5s ease-out forwards;
                }

                .input-group:nth-child(1) { animation-delay: 0.8s; }
                .input-group:nth-child(2) { animation-delay: 0.95s; }
                .input-group:nth-child(3) { animation-delay: 1.1s; }

                @keyframes inputSlideIn {
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }

                .input-field {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid #E5E7EB;
                    background: rgba(255, 255, 255, 0.8);
                    position: relative;
                }

                .input-field:focus {
                    border-color: var(--accent-color);
                    box-shadow:
                        0 0 0 4px rgba(212, 165, 116, 0.15),
                        0 4px 12px rgba(212, 165, 116, 0.1);
                    background: white;
                    transform: translateY(-2px);
                }

                .input-field:hover:not(:focus) {
                    border-color: var(--primary-light);
                    background: white;
                }

                .input-label {
                    transition: all 0.3s ease;
                    position: relative;
                }

                .input-label::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: var(--accent-color);
                    transition: width 0.3s ease;
                }

                .input-group:focus-within .input-label::after {
                    width: 100%;
                }

                .input-group:focus-within .input-label {
                    color: var(--primary-color);
                }

                /* ========== BUTTON ANIMATIONS ========== */
                .btn-submit {
                    background: var(--gradient);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                    overflow: hidden;
                    transform: translateY(30px);
                    opacity: 0;
                    animation: buttonReveal 0.6s ease-out forwards;
                    animation-delay: 1.2s;
                }

                @keyframes buttonReveal {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .btn-submit::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent);
                    transition: left 0.6s ease;
                }

                .btn-submit:hover::before {
                    left: 100%;
                }

                .btn-submit:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow:
                        0 12px 24px -4px rgba(30, 58, 95, 0.35),
                        var(--shadow-gold);
                }

                .btn-submit:active {
                    transform: translateY(-1px) scale(0.98);
                }

                /* Ripple effect on click */
                .btn-submit::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: translate(-50%, -50%);
                    transition: width 0.6s, height 0.6s;
                }

                .btn-submit:active::after {
                    width: 300px;
                    height: 300px;
                    opacity: 0;
                }

                /* ========== LINK ANIMATIONS ========== */
                .link-accent {
                    color: var(--primary-color);
                    transition: all 0.3s ease;
                    position: relative;
                    text-decoration: none;
                }

                .link-accent::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: linear-gradient(90deg, var(--accent-color), var(--accent-light));
                    transition: width 0.3s ease;
                }

                .link-accent:hover {
                    color: var(--accent-dark);
                }

                .link-accent:hover::after {
                    width: 100%;
                }

                .footer-links {
                    opacity: 0;
                    transform: translateY(20px);
                    animation: footerReveal 0.5s ease-out forwards;
                    animation-delay: 1.4s;
                }

                @keyframes footerReveal {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                /* ========== LOGO ANIMATION ========== */
                .logo-container {
                    background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
                    padding: 10px 16px;
                    border-radius: 14px;
                    box-shadow:
                        0 4px 16px rgba(30, 58, 95, 0.3),
                        inset 0 1px 0 rgba(255, 255, 255, 0.1);
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    position: relative;
                    overflow: hidden;
                    transform: translateY(-20px);
                    opacity: 0;
                    animation: logoEntrance 0.6s ease-out forwards;
                }

                @keyframes logoEntrance {
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }

                .logo-container::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    left: -50%;
                    width: 200%;
                    height: 200%;
                    background: radial-gradient(circle, rgba(212, 165, 116, 0.2) 0%, transparent 50%);
                    animation: logoGlow 3s ease-in-out infinite;
                    opacity: 0;
                }

                @keyframes logoGlow {
                    0%, 100% { opacity: 0; transform: scale(0.8); }
                    50% { opacity: 1; transform: scale(1); }
                }

                .logo-container:hover {
                    transform: translateY(-3px) scale(1.02);
                    box-shadow:
                        0 8px 24px rgba(30, 58, 95, 0.4),
                        var(--shadow-gold);
                    border-color: var(--accent-color);
                }

                .logo-container:hover::before {
                    animation-duration: 1.5s;
                }

                .logo-container img {
                    filter: brightness(0) invert(1);
                    transition: transform 0.3s ease;
                }

                .logo-container:hover img {
                    transform: scale(1.05);
                }

                /* ========== CHECKBOX ANIMATION ========== */
                .checkbox-wrapper {
                    opacity: 0;
                    animation: checkboxReveal 0.4s ease-out forwards;
                    animation-delay: 1.05s;
                }

                @keyframes checkboxReveal {
                    to { opacity: 1; }
                }

                .custom-checkbox {
                    position: relative;
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                }

                .custom-checkbox input {
                    opacity: 0;
                    width: 0;
                    height: 0;
                }

                .custom-checkbox .checkmark {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 20px;
                    height: 20px;
                    background: white;
                    border: 2px solid #E5E7EB;
                    border-radius: 6px;
                    transition: all 0.3s ease;
                }

                .custom-checkbox:hover .checkmark {
                    border-color: var(--accent-color);
                }

                .custom-checkbox input:checked ~ .checkmark {
                    background: var(--gradient);
                    border-color: var(--primary-color);
                    animation: checkPop 0.4s ease;
                }

                @keyframes checkPop {
                    0% { transform: scale(1); }
                    50% { transform: scale(1.2); }
                    100% { transform: scale(1); }
                }

                .custom-checkbox .checkmark::after {
                    content: '';
                    position: absolute;
                    display: none;
                    left: 6px;
                    top: 2px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .custom-checkbox input:checked ~ .checkmark::after {
                    display: block;
                    animation: checkmarkDraw 0.3s ease-out;
                }

                @keyframes checkmarkDraw {
                    from { height: 0; }
                    to { height: 10px; }
                }

                /* ========== LOADING SPINNER ENHANCEMENT ========== */
                .spinner-enhanced {
                    animation: spinPulse 1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
                }

                @keyframes spinPulse {
                    0% { transform: rotate(0deg) scale(1); }
                    50% { transform: rotate(180deg) scale(1.1); }
                    100% { transform: rotate(360deg) scale(1); }
                }
            `}),a.jsxs("div",{className:"min-h-screen login-bg flex flex-col py-12 px-4",children:[a.jsxs("div",{className:"animated-bg",children:[a.jsx("div",{className:"aurora"}),a.jsx("div",{className:"morph-blob morph-blob-1"}),a.jsx("div",{className:"morph-blob morph-blob-2"}),a.jsx("div",{className:"morph-blob morph-blob-3"}),a.jsx("div",{className:"diamond-container",children:Array.from({length:8},(t,e)=>a.jsx("div",{className:"diamond",style:{left:`${10+e*12}%`,top:`${100+Math.random()*20}%`,animationDelay:`${e*2.5}s`,animationDuration:`${18+Math.random()*8}s`,width:`${8+Math.random()*8}px`,height:`${8+Math.random()*8}px`}},`diamond-${e}`))}),a.jsx("div",{className:"sparkle-container",children:Array.from({length:25},(t,e)=>a.jsx("div",{className:"sparkle",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*3}s`,animationDuration:`${2+Math.random()*2}s`,width:`${2+Math.random()*4}px`,height:`${2+Math.random()*4}px`}},`sparkle-${e}`))}),a.jsx("div",{className:"flow-lines",children:Array.from({length:5},(t,e)=>a.jsx("div",{className:"flow-line",style:{top:`${20+e*18}%`,animationDelay:`${e*3}s`,animationDuration:`${10+e*2}s`,width:`${150+Math.random()*100}px`}},`flow-${e}`))})]}),a.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8 relative z-10",children:a.jsx("div",{className:"flex justify-start",children:a.jsx(l,{href:"/",className:"logo-container",children:a.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-10 w-auto object-contain"})})})}),a.jsx("div",{className:"flex-1 flex items-center justify-center relative z-10",children:a.jsx("div",{className:"w-full max-w-md",children:a.jsxs("div",{className:"form-card p-8",children:[a.jsx("h1",{className:"form-title text-2xl font-bold text-center mb-2",children:"Bem-vinda de Volta!"}),a.jsx("p",{className:"form-subtitle text-center text-gray-500 mb-8 text-sm",children:"Acesse sua conta e continue vendendo"}),a.jsxs("form",{onSubmit:x,method:"POST",action:"/login",className:"space-y-5",children:[a.jsxs("div",{className:"input-group",children:[a.jsx("label",{className:"input-label block text-sm font-medium text-gray-700 mb-1.5",children:"E-mail"}),a.jsx("input",{id:"email",type:"email",name:"email",value:n.email,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"username",autoFocus:!0,onChange:t=>s("email",t.target.value),placeholder:"seu@email.com"}),r.email&&a.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.email})]}),a.jsxs("div",{className:"input-group",children:[a.jsx("label",{className:"input-label block text-sm font-medium text-gray-700 mb-1.5",children:"Senha"}),a.jsx("input",{id:"password",type:"password",name:"password",value:n.password,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"current-password",onChange:t=>s("password",t.target.value),placeholder:"Digite sua senha"}),r.password&&a.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.password})]}),a.jsxs("div",{className:"checkbox-wrapper flex items-center justify-between",children:[a.jsxs("label",{className:"flex items-center cursor-pointer group",children:[a.jsx("input",{type:"checkbox",name:"remember",checked:n.remember,onChange:t=>s("remember",t.target.checked),className:"w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 focus:ring-2 transition-all duration-300",style:{accentColor:"#1E3A5F"}}),a.jsx("span",{className:"ml-2 text-sm text-gray-600 group-hover:text-gray-900 transition-colors",children:"Lembrar-me"})]}),p&&a.jsx(l,{href:"/forgot-password",className:"link-accent text-sm font-medium",children:"Esqueceu a senha?"})]}),a.jsx("button",{type:"submit",disabled:c,className:"btn-submit w-full py-3.5 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",children:c?a.jsxs("div",{className:"flex items-center justify-center",children:[a.jsxs("svg",{className:"spinner-enhanced -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[a.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),a.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Entrando..."]}):"Entrar"}),a.jsxs("div",{className:"footer-links text-center pt-2",children:[a.jsx("span",{className:"text-sm text-gray-500",children:"Ainda nao tem uma conta? "}),a.jsx(l,{href:"/register",className:"link-accent text-sm font-semibold",children:"Criar Conta"})]})]})]})})})]}),a.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{v as default};
