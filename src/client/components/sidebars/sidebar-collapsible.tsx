// Sidebar Varyant: Collapsible (sidebar-05 pattern)
// Açılır/kapanır alt menüler + arama kutusu
// Enterprise-ready: search, ikonlar, auth, branding

import { Link, useLocation } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
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

export function SidebarCollapsible() {
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
              <Label htmlFor="search-collapsible" className="sr-only">
                Ara
              </Label>
              <SidebarInput
                id="search-collapsible"
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
            {navSections.map((section, index) => (
              <Collapsible
                key={section.title}
                defaultOpen={index === 1}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <section.icon className="size-4" />
                      {section.title}
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
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
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
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
