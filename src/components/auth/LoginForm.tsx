import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeOpenIcon, EyeClosedIcon } from "@radix-ui/react-icons";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";

import { login, setAuthData } from "@/services/authService";
import { LoginPayload } from "@/types/api";

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const payload: LoginPayload = {
        email: formData.email,
        password: formData.password
      };
      
      const response = await login(payload);
      setAuthData(response.token, response.user.profile?.first_name || "");

      toast({
        title: "Login Realizado com Sucesso",
        description: "Bem-vindo ao seu Painel de OKRs!",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err: any) {
      toast({
        title: "Erro no Login",
        description: err.message,
        variant: "destructive"
      });
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md border-none shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 bg-white rounded-md"></div>
        </div>
        <div>
          <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bem-vindo de Volta
          </CardTitle>
          <CardDescription className="text-muted-foreground mt-2">
            Entre para acessar seu painel de OKRs
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={formData.email}
              onChange={handleInputChange}
              className="h-11 border-border/50 focus:border-primary transition-colors"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                className="h-11 pr-10 border-border/50 focus:border-primary transition-colors"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1 h-9 w-9 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeClosedIcon className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <EyeOpenIcon className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <Button variant="link" className="px-0 text-muted-foreground hover:text-primary">
              Esqueceu a senha?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full h-11 btn-hero"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Entrando...
              </div>
            ) : (
              "Entrar"
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Não tem uma conta?{" "}
            <Link 
              to="/register" 
              className="font-medium text-primary hover:text-primary/80 transition-colors"
            >
              Cadastre-se
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}