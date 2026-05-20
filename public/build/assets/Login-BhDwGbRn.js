import{x as h,r as u,V as r,j as e,Q as b,d as l}from"./app-CPboC0FU.js";import"./TextInput-D6AqKWkx.js";/* empty css            */function j({status:o,canResetPassword:d}){const{data:i,setData:n,post:m,processing:c,errors:s,reset:x}=h({email:"",password:"",remember:!1});u.useEffect(()=>{o&&r.success(o)},[o]);const p=a=>{a.preventDefault(),m("/login",{onFinish:()=>x("password"),onSuccess:()=>{r.success("Login realizado com sucesso!")},onError:t=>{t.email&&r.error(t.email),t.password&&r.error(t.password)}})};return e.jsxs(e.Fragment,{children:[e.jsx(b,{title:"Entrar - BBKits"}),e.jsx("style",{children:`
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

                .floating-shapes {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                    pointer-events: none;
                }

                .shape {
                    position: absolute;
                    background: rgba(212, 165, 116, 0.08);
                    border-radius: 50%;
                    animation: float 20s infinite ease-in-out;
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.5;
                    }
                    50% {
                        transform: translateY(-30px) rotate(180deg);
                        opacity: 0.8;
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
            `}),e.jsxs("div",{className:"min-h-screen login-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"floating-shapes",children:Array.from({length:6},(a,t)=>e.jsx("div",{className:"shape",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:`${Math.random()*120+40}px`,height:`${Math.random()*120+40}px`,animationDelay:`${Math.random()*10}s`,animationDuration:`${Math.random()*10+15}s`}},t))}),e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8 relative z-10",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(l,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-14 w-auto object-contain transition-all duration-300 hover:scale-105 rounded-xl bg-white p-2 shadow-md"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center relative z-10",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"form-card p-8",children:[e.jsx("h1",{className:"text-2xl font-bold text-center mb-2",style:{color:"#1E3A5F"},children:"Bem-vinda de Volta!"}),e.jsx("p",{className:"text-center text-gray-500 mb-8 text-sm",children:"Acesse sua conta e continue vendendo"}),e.jsxs("form",{onSubmit:p,method:"POST",action:"/login",className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:i.email,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"username",autoFocus:!0,onChange:a=>n("email",a.target.value),placeholder:"seu@email.com"}),s.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:i.password,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"current-password",onChange:a=>n("password",a.target.value),placeholder:"Digite sua senha"}),s.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:s.password})]}),e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("label",{className:"flex items-center cursor-pointer",children:[e.jsx("input",{type:"checkbox",name:"remember",checked:i.remember,onChange:a=>n("remember",a.target.checked),className:"w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900 focus:ring-2",style:{accentColor:"#1E3A5F"}}),e.jsx("span",{className:"ml-2 text-sm text-gray-600",children:"Lembrar-me"})]}),d&&e.jsx(l,{href:"/forgot-password",className:"link-accent text-sm font-medium",children:"Esqueceu a senha?"})]}),e.jsx("button",{type:"submit",disabled:c,className:"btn-submit w-full py-3 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",children:c?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Entrando..."]}):"Entrar"}),e.jsxs("div",{className:"text-center pt-2",children:[e.jsx("span",{className:"text-sm text-gray-500",children:"Ainda nao tem uma conta? "}),e.jsx(l,{href:"/register",className:"link-accent text-sm font-semibold",children:"Criar Conta"})]})]})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{j as default};
