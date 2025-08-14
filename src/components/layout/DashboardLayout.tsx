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

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const authData = getAuthData();
  const navigate = useNavigate();

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