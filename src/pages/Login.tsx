import { LoginForm } from "@/components/auth/LoginForm";
import heroImage from "@/assets/hero-illustration.jpg";

const Login = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
              Alcance Suas
              <span className="block bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                Metas Mais Rápido
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in-up [animation-delay:200ms]">
              Transforme seus objetivos em resultados mensuráveis com nossa plataforma avançada de OKRs.
            </p>
            <div className="space-y-4 animate-fade-in-up [animation-delay:400ms]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Acompanhe o progresso em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Colabore com sua equipe</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Alcance resultados mensuráveis</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse-ring"></div>
        <div className="absolute bottom-32 right-32 w-24 h-24 bg-accent/20 rounded-full blur-2xl animate-pulse-ring [animation-delay:1s]"></div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;