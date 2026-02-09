// Sidebar — FOX ürünü menüsü
// Collapsible: icon modunda daraltılabilir, mobilde Sheet olarak açılır

import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Database, Workflow, Sparkles } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";

// FOX menü — Ana Sayfa (özet) + 3 scope
const menuNav = [
  { name: "Ana Sayfa", href: "/", icon: LayoutDashboard },
  { name: "Scope 1: Konsolidasyon", href: "/fox/scope1", icon: Database },
  { name: "Scope 2: Operasyonlar", href: "/fox/scope2", icon: Workflow },
  { name: "Scope 3: AI Zeka", href: "/fox/scope3", icon: Sparkles },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img src="/OPLOG.png" alt="OPLOG" className="size-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">FOX</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Financial Operational eXcellence
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      location.pathname === item.href ||
                      (item.href === "/" && location.pathname === "/fox")
                    }
                    tooltip={item.name}
                  >
                    <Link to={item.href}>
                      <item.icon />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
