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
      { path: "/examples/form", element: <FormExamplePage /> },
      { path: "/examples/table", element: <TableExamplePage /> },
      { path: "/examples/chart", element: <ChartExamplePage /> },
      { path: "/examples/datagrid", element: <DataGridExamplePage /> },
    ],
  },
]);
