// React Router yapılandırması
// Yeni sayfa eklerken bu dosyaya route tanımı eklemeyi unutma
// /login hariç tüm route'lar AuthGate ile korunur

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { AuthGate } from "@/components/auth/auth-gate";
import { LoginPage } from "@/pages/login";
import { HomePage } from "@/pages/home";
import { FormExamplePage } from "@/pages/examples/form-example";
import { TableExamplePage } from "@/pages/examples/table-example";
import { ChartExamplePage } from "@/pages/examples/chart-example";
import { DataGridExamplePage } from "@/pages/examples/datagrid-example";
import { SidebarExamplePage } from "@/pages/examples/sidebar-example";
import { SidebarPreviewPage } from "@/pages/examples/sidebar-preview";
import { StatsExamplePage } from "@/pages/examples/stats-example";

// Örnek sayfalar — hem ana layout hem sidebar preview'da kullanılır
const exampleRoutes = [
  { path: "examples/form", element: <FormExamplePage /> },
  { path: "examples/table", element: <TableExamplePage /> },
  { path: "examples/chart", element: <ChartExamplePage /> },
  { path: "examples/datagrid", element: <DataGridExamplePage /> },
  { path: "examples/stats", element: <StatsExamplePage /> },
];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: (
      <AuthGate>
        <RootLayout />
      </AuthGate>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      ...exampleRoutes.map((r) => ({ ...r, path: `/${r.path}` })),
      { path: "/examples/sidebar", element: <SidebarExamplePage /> },
    ],
  },
  // Sidebar önizleme — RootLayout dışında (SidebarProvider çakışmasını önler)
  // Her sidebar varyantı tam ekran layout olarak çalışır, örnek sayfalar içinde navigasyon yapılabilir
  {
    path: "/preview/sidebar/:variant",
    element: (
      <AuthGate>
        <SidebarPreviewPage />
      </AuthGate>
    ),
    children: [
      { index: true, element: <HomePage /> },
      ...exampleRoutes,
    ],
  },
]);
