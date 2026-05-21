import{x as g,r as b,V as s,j as e,Q as h,d as l}from"./app-4EpxxEbX.js";import"./TextInput-C4n-ePya.js";/* empty css            */function y({status:o,canResetPassword:c}){const{data:i,setData:n,post:m,processing:d,errors:r,reset:p}=g({email:"",password:"",remember:!1});b.useEffect(()=>{o&&s.success(o)},[o]);const x=t=>{t.preventDefault(),m("/login",{onFinish:()=>p("password"),onSuccess:()=>{s.success("Login realizado com sucesso!")},onError:a=>{a.email&&s.error(a.email),a.password&&s.error(a.password)}})};return e.jsxs(e.Fragment,{children:[e.jsx(h,{title:"Entrar - BBKits"}),e.jsx("style",{children:`
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

                .login-bg {
                    background: var(--gradient-hero),
                                url('https://images.unsplash.com/photo-1555252333-9f8e92e65df9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80') center/cover;
                    position: relative;
                    overflow: hidden;
                }

                .login-bg::before {
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

                .logo-container {
                    background: linear-gradient(135deg, #1E3A5F 0%, #2D4A6F 100%);
                    padding: 10px 16px;
                    border-radius: 12px;
                    box-shadow: 0 4px 12px rgba(30, 58, 95, 0.25);
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 2px solid transparent;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .logo-container:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(30, 58, 95, 0.35);
                    border-color: var(--accent-color);
                }

                .logo-container img {
                    filter: brightness(0) invert(1);
                }
            `}),e.jsxs("div",{className:"min-h-screen login-bg flex flex-col py-12 px-4",children:[e.jsxs("div",{className:"animated-bg",children:[e.jsx("div",{className:"gradient-mesh"}),e.jsx("div",{className:"orb orb-1"}),e.jsx("div",{className:"orb orb-2"}),e.jsx("div",{className:"orb orb-3"}),e.jsx("div",{className:"particles",children:Array.from({length:15},(t,a)=>e.jsx("div",{className:"particle",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,animationDelay:`${Math.random()*15}s`,animationDuration:`${Math.random()*10+10}s`,width:`${Math.random()*4+2}px`,height:`${Math.random()*4+2}px`}},a))}),e.jsx("div",{className:"glow-lines",children:Array.from({length:4},(t,a)=>e.jsx("div",{className:"glow-line",style:{left:`${20+a*20}%`,animationDelay:`${a*2}s`,animationDuration:`${6+a}s`}},a))})]}),e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8 relative z-10",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(l,{href:"/",className:"logo-container",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-10 w-auto object-contain"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center relative z-10",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"form-card p-8",children:[e.jsx("h1",{className:"text-2xl font-bold text-center mb-2",style:{color:"#1E3A5F"},children:"Bem-vinda de Volta!"}),e.jsx("p",{className:"text-center text-gray-500 mb-8 text-sm",children:"Acesse sua conta e continue vendendo"}),e.jsxs("form",{onSubmit:x,method:"POST",action:"/login",className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:i.email,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"username",autoFocus:!0,onChange:t=>n("email",t.target.value),placeholder:"seu@email.com"}),r.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:i.password,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"current-password",onChange:t=>n("password",t.target.value),placeholder:"Digite sua senha"}),r.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:r.password})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",name:"remember",checked:i.remember,onChange:t=>n("remember",t.target.checked),className:"w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 focus:ring-2",style:{accentColor:"#1E3A5F"}}),e.jsx("span",{className:"ml-2 text-sm text-gray-600",children:"Lembrar-me"})]}),c&&e.jsx(l,{href:"/forgot-password",className:"link-accent text-sm font-medium",children:"Esqueceu a senha?"})]}),e.jsx("button",{type:"submit",disabled:d,className:"btn-submit w-full py-3 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",children:d?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Entrando..."]}):"Entrar"}),e.jsxs("div",{className:"text-center pt-2",children:[e.jsx("span",{className:"text-sm text-gray-500",children:"Ainda nao tem uma conta? "}),e.jsx(l,{href:"/register",className:"link-accent text-sm font-semibold",children:"Criar Conta"})]})]})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{y as default};
