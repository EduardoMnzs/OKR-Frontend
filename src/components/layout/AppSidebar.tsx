import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Target, Home, LogOut, Plus } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar, SidebarFooter } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { CreateOKRModal } from "@/components/okr/CreateOKRModal";

import { removeAuthData } from "@/services/authService";

const menuItems = [{
  title: "Home",
  url: "/dashboard",
  icon: Home
}];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const isCollapsed = state === "collapsed";
  const isActive = (path: string) => currentPath === path;

  const handleLogout = () => {
    removeAuthData();
    navigate("/login");
  };

  return (
    <Sidebar className="border-r border-border/50 bg-sidebar/50 backdrop-blur-sm">
      <SidebarHeader className="border-b border-border/50 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
          {!isCollapsed && (
            <div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Plataforma OKR
              </h2>
              <p className="text-xs text-sidebar-foreground/70">Gestão de Metas</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        {!isCollapsed && (
          <div className="px-2 py-4">
            <CreateOKRModal>
              <Button className="w-full btn-hero justify-start gap-2">
                <Plus className="w-4 h-4" />
                Criar OKR
              </Button>
            </CreateOKRModal>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Navegação
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:bg-muted/50 text-sidebar-foreground"}`}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0 text-sidebar-foreground" />
                      {!isCollapsed && (
                        <span className="flex-1 text-sm font-medium text-sidebar-foreground text-left">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-muted/50 text-sidebar-foreground w-full"
              >
                <LogOut className="w-5 h-5 flex-shrink-0 text-sidebar-foreground" />
                {!isCollapsed && (
                  <span className="flex-1 text-sm font-medium text-sidebar-foreground text-left">
                    Logout
                  </span>
                )}
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}