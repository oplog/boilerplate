// Header bileşeni - shadcn/ui SidebarTrigger + Breadcrumb pattern
// Sidebar toggle butonu ve sayfa breadcrumb'ı içerir

import { useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
  const isExample = location.pathname.startsWith("/examples/");
  const pageTitle = pageTitles[location.pathname] ?? "Sayfa";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
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
    </header>
  );
}
