// React Router yapilandirmasi
// Yeni sayfa eklerken bu dosyaya route tanimi eklemeyi unutma
// Auth: Cloudflare Zero Trust edge'de halleder, app icinde login sayfasi YOK

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/pages/home";
import { FormExamplePage } from "@/pages/examples/form-example";
import { TableExamplePage } from "@/pages/examples/table-example";
import { ChartExamplePage } from "@/pages/examples/chart-example";
import { DataGridExamplePage } from "@/pages/examples/datagrid-example";
import { SidebarExamplePage } from "@/pages/examples/sidebar-example";
import { SidebarPreviewPage } from "@/pages/examples/sidebar-preview";
import { StatsExamplePage } from "@/pages/examples/stats-example";
import { NotFoundPage } from "@/pages/not-found";
import { ShowcasePage } from "@/pages/showcase";
import { DashboardTemplatePage } from "@/pages/templates/dashboard-template";
import { CrudTableTemplatePage } from "@/pages/templates/crud-table-template";
import { FormTemplatePage } from "@/pages/templates/form-template";
import { DetailTemplatePage } from "@/pages/templates/detail-template";
import { KanbanTemplatePage } from "@/pages/templates/kanban-template";
import { ReportTemplatePage } from "@/pages/templates/report-template";

// Ornek sayfalar — hem ana layout hem sidebar preview'da kullanilir
const exampleRoutes = [
  { path: "examples/form", element: <FormExamplePage /> },
  { path: "examples/table", element: <TableExamplePage /> },
  { path: "examples/chart", element: <ChartExamplePage /> },
  { path: "examples/datagrid", element: <DataGridExamplePage /> },
  { path: "examples/stats", element: <StatsExamplePage /> },
];

// Sayfa sablonlari — kullanici isteklerine gore ozellestirilen referans sayfalar
const templateRoutes = [
  { path: "templates/dashboard", element: <DashboardTemplatePage /> },
  { path: "templates/crud-table", element: <CrudTableTemplatePage /> },
  { path: "templates/form", element: <FormTemplatePage /> },
  { path: "templates/detail", element: <DetailTemplatePage /> },
  { path: "templates/kanban", element: <KanbanTemplatePage /> },
  { path: "templates/report", element: <ReportTemplatePage /> },
];

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/showcase", element: <ShowcasePage /> },
      ...exampleRoutes.map((r) => ({ ...r, path: `/${r.path}` })),
      ...templateRoutes.map((r) => ({ ...r, path: `/${r.path}` })),
      { path: "/examples/sidebar", element: <SidebarExamplePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  // Sidebar onizleme — RootLayout disinda (SidebarProvider cakismasini onler)
  {
    path: "/preview/sidebar/:variant",
    element: <SidebarPreviewPage />,
    children: [
      { index: true, element: <HomePage /> },
      ...exampleRoutes,
    ],
  },
]);
