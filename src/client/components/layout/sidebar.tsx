// Sidebar bileşeni - shadcn/ui Sidebar pattern (sidebar-07)
// Collapsible: icon modunda daraltılabilir, mobilde Sheet olarak açılır
// NavUser: sidebar-07 nav-user pattern ile kullanıcı menüsü

import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FileText,
  Table,
  BarChart3,
  Grid3x3,
  PanelLeft,
  Activity,
  LayoutDashboard,
  ListChecks,
  ClipboardEdit,
  Eye,
  Columns3,
  TrendingUp,
  Component,
} from "lucide-react";
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

// ─── Navigasyon menü öğeleri ─────────────────────────────────
const mainNav = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Bileşen Kataloğu", href: "/showcase", icon: Component },
];

const templateNav = [
  { name: "Dashboard", href: "/templates/dashboard", icon: LayoutDashboard },
  { name: "CRUD Tablo", href: "/templates/crud-table", icon: ListChecks },
  { name: "Form", href: "/templates/form", icon: ClipboardEdit },
  { name: "Detay", href: "/templates/detail", icon: Eye },
  { name: "Kanban", href: "/templates/kanban", icon: Columns3 },
  { name: "Rapor", href: "/templates/report", icon: TrendingUp },
];

const exampleNav = [
  { name: "Form Örneği", href: "/examples/form", icon: FileText },
  { name: "Tablo Örneği", href: "/examples/table", icon: Table },
  { name: "Grafik Örneği", href: "/examples/chart", icon: BarChart3 },
  { name: "DataGrid Örneği", href: "/examples/datagrid", icon: Grid3x3 },
  { name: "Stats Örnekleri", href: "/examples/stats", icon: Activity },
  { name: "Sidebar Örnekleri", href: "/examples/sidebar", icon: PanelLeft },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" variant="sidebar">
      {/* ─── Logo / Başlık ─────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
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
      </SidebarHeader>

      {/* ─── Navigasyon ────────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
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

        <SidebarGroup>
          <SidebarGroupLabel>Şablonlar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {templateNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
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

        <SidebarGroup>
          <SidebarGroupLabel>Örnekler</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {exampleNav.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={location.pathname === item.href}
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

      {/* ─── Kullanıcı menüsü ─────────────────────── */}
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
