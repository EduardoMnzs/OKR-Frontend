import { ReactNode, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Clock, MessageCircle, AlertTriangle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { Badge } from "@/components/ui/badge";
import { getAuthData, removeAuthData } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query"; // Importe useQuery
import { getNotifications, Notification } from "@/services/okrService"; // Importe a função e a interface

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const authData = getAuthData();
  const navigate = useNavigate();

  // Use useQuery para buscar as notificações
  const { data: notifications, isLoading, isError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
    enabled: notificationsOpen, // Busca apenas quando o popover é aberto
  });

  const userInitials = authData.firstName && authData.lastName
    ? `${authData.firstName.charAt(0)}${authData.lastName.charAt(0)}`
    : '??';

  const handleLogout = () => {
    removeAuthData();
    navigate('/login');
  };
  
  const getIconForNotification = (type: string) => {
    switch (type) {
        case "update":
            return <Clock className="w-4 h-4 text-success" />;
        case "comment":
            return <MessageCircle className="w-4 h-4 text-primary" />;
        case "deadline":
            return <AlertTriangle className="w-4 h-4 text-warning" />;
        default:
            return <Bell className="w-4 h-4 text-muted" />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border/50 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-muted/50" />
            </div>
            
            <div className="flex items-center gap-3">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative hover:bg-muted/50"
                  >
                    <Bell className="w-5 h-5" />
                    {notifications?.length > 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full border-2 border-background flex items-center justify-center">
                        <span className="text-[8px] font-bold text-accent-foreground">{notifications.length}</span>
                      </div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b border-border">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-sm">Notificações</h3>
                      <Badge variant="secondary" className="text-xs">
                        {notifications?.length} novas
                      </Badge>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications === undefined || isLoading ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Carregando notificações...</p>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <p>Nenhuma notificação por enquanto.</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <div 
                          key={notification.id}
                          className="p-4 border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getIconForNotification(notification.event_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-foreground line-clamp-1">
                                {notification.event_type === "comment" ? "Novo Comentário" : "OKR Atualizado"}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="p-3 bg-muted/20">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full text-xs hover:bg-muted/50"
                    >
                      Ver todas as notificações
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <ThemeToggle />
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                      <AvatarFallback className="bg-gradient-hero text-white font-medium">
                        {userInitials}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-popover border border-border z-50">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-popover-foreground">
                        {authData.firstName} {authData.lastName}
                      </p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {authData.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="text-popover-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 overflow-auto scrollbar-thin">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}