// Global Command Palette — Cmd+K / Ctrl+K ile açılır
// Sayfalar, şablonlar ve hızlı aksiyonlar için spotlight benzeri arama
// Dışarıdan açmak için: window.dispatchEvent(new Event("open-command-palette"))

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Moon,
  Sun,
  Component,
  Search,
} from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useTheme } from "@/components/theme-provider";

const pages = [
  { name: "Ana Sayfa", href: "/", icon: Home },
  { name: "Bileşen Kataloğu", href: "/showcase", icon: Component },
  { name: "Form Örneği", href: "/examples/form", icon: FileText },
  { name: "Tablo Örneği", href: "/examples/table", icon: Table },
  { name: "Grafik Örneği", href: "/examples/chart", icon: BarChart3 },
  { name: "DataGrid Örneği", href: "/examples/datagrid", icon: Grid3x3 },
  { name: "Stats Örnekleri", href: "/examples/stats", icon: Activity },
  { name: "Sidebar Örnekleri", href: "/examples/sidebar", icon: PanelLeft },
];

const templates = [
  { name: "Dashboard Şablonu", href: "/templates/dashboard", icon: LayoutDashboard },
  { name: "CRUD Tablo Şablonu", href: "/templates/crud-table", icon: ListChecks },
  { name: "Form Şablonu", href: "/templates/form", icon: ClipboardEdit },
  { name: "Detay Şablonu", href: "/templates/detail", icon: Eye },
  { name: "Kanban Şablonu", href: "/templates/kanban", icon: Columns3 },
  { name: "Rapor Şablonu", href: "/templates/report", icon: TrendingUp },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const isDark =
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  // Custom event ile dışarıdan açılabilir
  useEffect(() => {
    function onOpen() {
      setOpen(true);
    }
    window.addEventListener("open-command-palette", onOpen);
    return () => window.removeEventListener("open-command-palette", onOpen);
  }, []);

  function go(href: string) {
    setOpen(false);
    navigate(href);
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Sayfa ara, şablon seç..." />
      <CommandList>
        <CommandEmpty>Sonuç bulunamadı.</CommandEmpty>

        <CommandGroup heading="Sayfalar">
          {pages.map((p) => (
            <CommandItem key={p.href} onSelect={() => go(p.href)}>
              <p.icon className="mr-2 h-4 w-4" />
              <span>{p.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Şablonlar">
          {templates.map((t) => (
            <CommandItem key={t.href} onSelect={() => go(t.href)}>
              <t.icon className="mr-2 h-4 w-4" />
              <span>{t.name}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Eylemler">
          <CommandItem
            onSelect={() => {
              setTheme(isDark ? "light" : "dark");
              setOpen(false);
            }}
          >
            {isDark ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{isDark ? "Açık Tema" : "Koyu Tema"}</span>
          </CommandItem>
          <CommandItem
            onSelect={() => {
              window.open("/api/docs", "_blank");
              setOpen(false);
            }}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>API Docs (Swagger)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
