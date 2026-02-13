// Header bileseni - SidebarTrigger + Breadcrumb + Tema toggle
// Sidebar toggle butonu, sayfa breadcrumb'i ve tema ikonu icerir

import { useLocation } from "react-router-dom";
import { Moon, Sun, Search } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTheme } from "@/components/theme-provider";
import { Kbd } from "@/components/ui/kbd";

// Sayfa basliklari - yeni sayfa eklerken buraya da ekle
const pageTitles: Record<string, string> = {
  "/": "Ana Sayfa",
  "/showcase": "Bileşen Kataloğu",
  "/examples/form": "Form Ornegi",
  "/examples/table": "Tablo Ornegi",
  "/examples/chart": "Grafik Ornegi",
  "/examples/datagrid": "DataGrid Ornegi",
  "/examples/sidebar": "Sidebar Ornekleri",
  "/examples/stats": "Stats Ornekleri",
  "/templates/dashboard": "Dashboard Şablonu",
  "/templates/crud-table": "CRUD Tablo Şablonu",
  "/templates/form": "Form Şablonu",
  "/templates/detail": "Detay Şablonu",
  "/templates/kanban": "Kanban Şablonu",
  "/templates/report": "Rapor Şablonu",
};

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const isExample = location.pathname.startsWith("/examples/");
  const isTemplate = location.pathname.startsWith("/templates/");
  const pageTitle = pageTitles[location.pathname] ?? "Sayfa";

  const isDark =
    theme === "dark" ||
    (theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="/">OPLOG</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            {isExample && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Örnekler</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            {isTemplate && (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Şablonlar</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1">
        {/* Command palette trigger */}
        <Button
          variant="outline"
          size="sm"
          className="hidden gap-2 text-muted-foreground md:flex"
          onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Ara...</span>
          <Kbd>⌘K</Kbd>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => window.dispatchEvent(new Event("open-command-palette"))}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Ara</span>
        </Button>
        {/* Tema toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Tema degistir</span>
        </Button>
      </div>
    </header>
  );
}
