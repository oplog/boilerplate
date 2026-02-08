// Sidebar Varyant: Submenu (sidebar-03 pattern)
// Her zaman açık alt menüler ile dokümantasyon stili sidebar
// Enterprise-ready: search, ikonlar, auth, branding

import { Link, useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useBasePath, getNavSections } from "@/lib/sidebar-nav";

export function SidebarSubmenu() {
  const location = useLocation();
  const basePath = useBasePath();
  const navSections = getNavSections(basePath);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to={basePath || "/"}>
                <img src="/OPLOG.png" alt="OPLOG" className="size-8" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">OPLOG</span>
                  <span className="truncate text-xs text-muted-foreground">
                    App Builder
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <form>
          <SidebarGroup className="py-0">
            <SidebarGroupContent className="relative">
              <Label htmlFor="search-submenu" className="sr-only">
                Ara
              </Label>
              <SidebarInput
                id="search-submenu"
                placeholder="Menüde ara..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navSections.map((section) => (
              <SidebarMenuItem key={section.title}>
                <SidebarMenuButton asChild>
                  <span className="font-medium">
                    <section.icon className="size-4" />
                    {section.title}
                  </span>
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {section.items.map((item) => (
                    <SidebarMenuSubItem key={item.title}>
                      <SidebarMenuSubButton
                        asChild
                        isActive={location.pathname === item.href}
                      >
                        <Link to={item.href}>{item.title}</Link>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))}
                </SidebarMenuSub>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
