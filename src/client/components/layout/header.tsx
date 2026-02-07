// Header bileşeni - shadcn/ui SidebarTrigger + Breadcrumb + Tema toggle
// Sidebar toggle butonu, sayfa breadcrumb'ı ve tema ikonu içerir

import { useLocation } from "react-router-dom";
import { Moon, Sun } from "lucide-react";
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

// Sayfa başlıkları - yeni sayfa eklerken buraya da ekle
const pageTitles: Record<string, string> = {
  "/": "Ana Sayfa",
  "/examples/form": "Form Örneği",
  "/examples/table": "Tablo Örneği",
  "/examples/chart": "Grafik Örneği",
  "/examples/datagrid": "DataGrid Örneği",
};

export function Header() {
  const location = useLocation();
  const { theme, setTheme } = useTheme();
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

      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        <span className="sr-only">Tema değiştir</span>
      </Button>
    </header>
  );
}
