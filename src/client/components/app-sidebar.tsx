"use client"

import { Link } from "react-router-dom"
import {
  BookOpen,
  TrendingUp,
  FileText,
  LifeBuoy,
} from "lucide-react"
import { useKindeAuth } from "@kinde-oss/kinde-auth-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const navMain = [
  {
    title: "Muhasebe",
    url: "/accounting",
    icon: BookOpen,
    items: [
      { title: "Genel Bakış", url: "/accounting" },
      { title: "Hesap Planı", url: "/accounting/hesap-plani" },
      { title: "Yevmiye", url: "/accounting/yevmiye" },
      { title: "Mutabakat", url: "/accounting/mutabakat" },
    ],
  },
  {
    title: "Finansal Tablolar",
    url: "/financial-statements",
    icon: TrendingUp,
    items: [
      { title: "Genel Bakış", url: "/financial-statements" },
      { title: "Gelir Tablosu (P&L)", url: "/financial-statements/pnl" },
      { title: "Bilanço", url: "/financial-statements/bilanco" },
      { title: "Nakit Akışı", url: "/financial-statements/nakit-akisi" },
    ],
  },
]

const navSecondary = [
  { title: "Strateji dokümanı", url: "/fox", icon: FileText },
  { title: "Destek", url: "#", icon: LifeBuoy },
]

function useFoxUser() {
  const { user: kindeUser, logout } = useKindeAuth()
  if (!kindeUser) {
    return {
      user: { name: "Kullanıcı", email: "", avatar: "" },
      logout: undefined,
    }
  }
  const name = [kindeUser.given_name, kindeUser.family_name].filter(Boolean).join(" ") || kindeUser.email || "Kullanıcı"
  return {
    user: {
      name,
      email: kindeUser.email ?? "",
      avatar: kindeUser.picture ?? "",
    },
    logout: () => logout(),
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useFoxUser()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img src="/OPLOG.png" alt="OPLOG" className="size-8 rounded-lg object-contain" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">FOX</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Financial Operational eXcellence
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} groupLabel="Menü" />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} onLogout={logout} />
      </SidebarFooter>
    </Sidebar>
  )
}
