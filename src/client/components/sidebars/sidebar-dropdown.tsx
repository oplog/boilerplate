// Sidebar Varyant: Dropdown (sidebar-06 pattern)
// Alt menüler dropdown olarak açılır
// Enterprise-ready: search, ikonlar, auth, branding

import { Link, useLocation } from "react-router-dom";
import { Search, ChevronRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useBasePath, getNavSections } from "@/lib/sidebar-nav";

function NavMain() {
  const { isMobile } = useSidebar();
  const location = useLocation();
  const basePath = useBasePath();
  const navSections = getNavSections(basePath);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {navSections.map((section) => (
          <DropdownMenu key={section.title}>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                  <section.icon className="size-4" />
                  {section.title}
                  <ChevronRight className="ml-auto transition-transform duration-200 data-[state=open]:rotate-90" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
                className="min-w-56 rounded-lg"
              >
                {section.items.map((item) => (
                  <DropdownMenuItem asChild key={item.title}>
                    <Link
                      to={item.href}
                      className={
                        location.pathname === item.href ? "font-medium" : ""
                      }
                    >
                      <item.icon className="mr-2 size-4 text-muted-foreground" />
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </SidebarMenuItem>
          </DropdownMenu>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function SidebarDropdown() {
  const basePath = useBasePath();

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
              <Label htmlFor="search-dropdown" className="sr-only">
                Ara
              </Label>
              <SidebarInput
                id="search-dropdown"
                placeholder="Menüde ara..."
                className="pl-8"
              />
              <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
            </SidebarGroupContent>
          </SidebarGroup>
        </form>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
