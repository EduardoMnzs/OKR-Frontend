import { RegisterForm } from "@/components/auth/RegisterForm";
import heroImage from "@/assets/hero-illustration.jpg";

const Register = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 animate-fade-in-up">
              Comece Sua
              <span className="block bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">
                Jornada Hoje
              </span>
            </h1>
            <p className="text-xl text-white/90 mb-8 animate-fade-in-up [animation-delay:200ms]">
              Junte-se a milhares de profissionais que já transformaram suas metas em realidade.
            </p>
            <div className="space-y-4 animate-fade-in-up [animation-delay:400ms]">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Configuração rápida em 2 minutos</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Interface intuitiva e moderna</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <span className="text-white/90">Suporte dedicado da equipe</span>
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

      {/* Right Side - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md animate-slide-in-right">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default Register;