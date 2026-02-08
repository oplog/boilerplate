// Sidebar Varyant: Double / Nested (sidebar-09 pattern)
// Sol: dar ikon rail — Sağ: geniş içerik paneli
// Enterprise-ready: search, ikonlar, auth, branding

import * as React from "react";
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
  SidebarMenuSubButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import { useBasePath, getNavSections } from "@/lib/sidebar-nav";

export function SidebarDouble({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const basePath = useBasePath();
  const navSections = getNavSections(basePath);
  const [activeSection, setActiveSection] = React.useState(navSections[0]);
  const { setOpen } = useSidebar();
  const location = useLocation();

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* ─── Sol: Dar ikon rail ─────────────────────── */}
      <Sidebar
        collapsible="none"
        className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
      >
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="md:h-8 md:p-0">
                <Link to={basePath || "/"}>
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img src="/OPLOG.png" alt="OPLOG" className="size-6" />
                  </div>
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
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {navSections.map((section) => (
                  <SidebarMenuItem key={section.title}>
                    <SidebarMenuButton
                      tooltip={{ children: section.title, hidden: false }}
                      onClick={() => {
                        setActiveSection(section);
                        setOpen(true);
                      }}
                      isActive={activeSection.title === section.title}
                      className="px-2.5 md:px-2"
                    >
                      <section.icon />
                      <span>{section.title}</span>
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
      </Sidebar>

      {/* ─── Sağ: Geniş içerik paneli ──────────────── */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex">
        <SidebarHeader className="gap-3.5 border-b p-4">
          <div className="flex w-full items-center justify-between">
            <div className="text-base font-medium text-foreground">
              {activeSection.title}
            </div>
          </div>
          <div className="relative">
            <Label htmlFor="search-double" className="sr-only">
              Ara
            </Label>
            <SidebarInput
              id="search-double"
              placeholder="Menüde ara..."
              className="pl-8"
            />
            <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {activeSection.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={location.pathname === item.href}
                    >
                      <Link to={item.href} className="flex items-center gap-2">
                        <item.icon className="size-4 text-muted-foreground" />
                        {item.title}
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  );
}
