import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, SidebarIcon } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useTheme } from "@/components/theme-provider"

const routeLabels: Record<string, string> = {
  "/": "Ana Sayfa",
  "/fox": "Ana Sayfa",
  "/fox/scope1": "Scope 1: Konsolidasyon",
  "/fox/scope2": "Scope 2: Operasyonlar",
  "/fox/scope3": "Scope 3: AI Zeka",
  "/accounting": "Muhasebe",
  "/accounting/hesap-plani": "Hesap Planı",
  "/accounting/yevmiye": "Yevmiye",
  "/accounting/mutabakat": "Mutabakat",
  "/financial-statements": "Finansal Tablolar",
  "/financial-statements/pnl": "Gelir Tablosu (P&L)",
  "/financial-statements/bilanco": "Bilanço",
  "/financial-statements/nakit-akisi": "Nakit Akışı",
}

export function SiteHeader() {
  const { toggleSidebar } = useSidebar()
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const pathname = location.pathname
  const pageTitle = routeLabels[pathname] ?? "FOX"
  const isDark =
    theme === "dark" ||
    (typeof window !== "undefined" &&
      theme === "system" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div
        className="flex w-full items-center gap-2 px-4"
        style={{ height: "var(--header-height)" }}
      >
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb className="hidden sm:block">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">FOX</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(isDark ? "light" : "dark")}
        >
          {isDark ? (
            <Sun className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4" />
          )}
          <span className="sr-only">Tema değiştir</span>
        </Button>
      </div>
    </header>
  )
}
