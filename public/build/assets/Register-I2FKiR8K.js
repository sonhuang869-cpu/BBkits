import{x as p,j as e,Q as u,d as n,V as l}from"./app-BQ4nET-1.js";import"./TextInput-CFwmf9Cu.js";/* empty css            */function b(){const{data:s,setData:r,post:d,processing:i,errors:t,reset:c}=p({name:"",email:"",password:"",password_confirmation:""}),m=a=>{a.preventDefault(),d("/register",{onFinish:()=>c("password","password_confirmation"),onSuccess:()=>{l.success("Conta criada com sucesso!")},onError:o=>{Object.keys(o).forEach(x=>{l.error(o[x])})}})};return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:"Cadastro - BBKits"}),e.jsx("style",{children:`
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
            `}),e.jsxs("div",{className:"min-h-screen register-bg flex flex-col py-12 px-4",children:[e.jsx("div",{className:"floating-shapes",children:Array.from({length:6},(a,o)=>e.jsx("div",{className:"shape",style:{left:`${Math.random()*100}%`,top:`${Math.random()*100}%`,width:`${Math.random()*120+40}px`,height:`${Math.random()*120+40}px`,animationDelay:`${Math.random()*10}s`,animationDuration:`${Math.random()*10+15}s`}},o))}),e.jsx("div",{className:"w-full max-w-6xl mx-auto mb-8 relative z-10",children:e.jsx("div",{className:"flex justify-start",children:e.jsx(n,{href:"/",children:e.jsx("img",{src:"/images/logo.webp",alt:"BBKits Logo",className:"h-14 w-auto object-contain transition-all duration-300 hover:scale-105 rounded-xl bg-white p-2 shadow-md"})})})}),e.jsx("div",{className:"flex-1 flex items-center justify-center relative z-10",children:e.jsx("div",{className:"w-full max-w-md",children:e.jsxs("div",{className:"form-card p-8",children:[e.jsx("h1",{className:"text-2xl font-bold text-center mb-2",style:{color:"#1E3A5F"},children:"Criar Conta"}),e.jsx("p",{className:"text-center text-gray-500 mb-8 text-sm",children:"Junte-se as vendedoras de sucesso da BBkits"}),e.jsxs("form",{onSubmit:m,className:"space-y-5",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Nome Completo"}),e.jsx("input",{id:"name",type:"text",name:"name",value:s.name,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"name",autoFocus:!0,onChange:a=>r("name",a.target.value),placeholder:"Digite seu nome completo",required:!0}),t.name&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:t.name})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"E-mail"}),e.jsx("input",{id:"email",type:"email",name:"email",value:s.email,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"username",onChange:a=>r("email",a.target.value),placeholder:"seu@email.com",required:!0}),t.email&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:t.email})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Senha"}),e.jsx("input",{id:"password",type:"password",name:"password",value:s.password,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"new-password",onChange:a=>r("password",a.target.value),placeholder:"Crie uma senha forte",required:!0}),t.password&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:t.password})]}),e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-gray-700 mb-1.5",children:"Confirmar Senha"}),e.jsx("input",{id:"password_confirmation",type:"password",name:"password_confirmation",value:s.password_confirmation,className:"input-field w-full px-4 py-3 rounded-xl focus:outline-none text-gray-900",autoComplete:"new-password",onChange:a=>r("password_confirmation",a.target.value),placeholder:"Confirme sua senha",required:!0}),t.password_confirmation&&e.jsx("p",{className:"mt-2 text-sm text-red-600",children:t.password_confirmation})]}),e.jsx("button",{type:"submit",disabled:i,className:"btn-submit w-full py-3 px-4 text-white font-semibold rounded-xl disabled:opacity-50 disabled:cursor-not-allowed",children:i?e.jsxs("div",{className:"flex items-center justify-center",children:[e.jsxs("svg",{className:"animate-spin -ml-1 mr-3 h-5 w-5 text-white",xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",children:[e.jsx("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),e.jsx("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}),"Criando conta..."]}):"Criar Minha Conta"}),e.jsxs("div",{className:"text-center pt-2",children:[e.jsx("span",{className:"text-sm text-gray-500",children:"Ja possui uma conta? "}),e.jsx(n,{href:"/login",className:"link-accent text-sm font-semibold",children:"Fazer Login"})]})]}),e.jsx("div",{className:"mt-6 pt-6 border-t border-gray-100",children:e.jsxs("div",{className:"text-center text-xs text-gray-400",children:[e.jsx("p",{children:"Ao criar uma conta, voce concorda com nossos"}),e.jsxs("div",{className:"space-x-2 mt-1",children:[e.jsx("a",{href:"#",className:"link-accent",children:"Termos de Uso"}),e.jsx("span",{children:"e"}),e.jsx("a",{href:"#",className:"link-accent",children:"Politica de Privacidade"})]})]})})]})})})]}),e.jsx("link",{rel:"stylesheet",href:"https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"})]})}export{b as default};
