// Header bileşeni - shadcn/ui SidebarTrigger + Breadcrumb + Font seçici + Tema toggle
// Sidebar toggle butonu, sayfa breadcrumb'ı, font picker ve tema ikonu içerir

import { useLocation } from "react-router-dom";
import { Moon, Sun, Type } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useTheme } from "@/components/theme-provider";
import { useFont, fontLabels } from "@/components/font-provider";
import type { AppFont } from "@/components/font-provider";

// Sayfa başlıkları - yeni sayfa eklerken buraya da ekle
const pageTitles: Record<string, string> = {
  "/": "Ana Sayfa",
  "/examples/form": "Form Örneği",
  "/examples/table": "Tablo Örneği",
  "/examples/chart": "Grafik Örneği",
  "/examples/datagrid": "DataGrid Örneği",
  "/examples/sidebar": "Sidebar Örnekleri",
};

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const { font, setFont } = useFont();
  const isExample = location.pathname.startsWith("/examples/");
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
            {isExample ? (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    OPLOG
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Örnekler
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">
                    OPLOG
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-1">
        {/* Font seçici */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Type className="h-4 w-4" />
              <span className="sr-only">Font değiştir</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Font</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={font} onValueChange={(v) => setFont(v as AppFont)}>
              {Object.entries(fontLabels).map(([value, label]) => (
                <DropdownMenuRadioItem key={value} value={value}>
                  {label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tema toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          <span className="sr-only">Tema değiştir</span>
        </Button>
      </div>
    </header>
  );
}
