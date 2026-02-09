// React Router yapılandırması — FOX ürünü
// /login hariç tüm route'lar AuthGate ile korunur

import { createBrowserRouter } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { AuthGate } from "@/components/auth/auth-gate";
import { LoginPage } from "@/pages/login";
import { FoxOverviewPage } from "@/pages/fox/overview";
import { FoxScope1Page } from "@/pages/fox/scope1";
import { FoxScope2Page } from "@/pages/fox/scope2";
import { FoxScope3Page } from "@/pages/fox/scope3";
import { AccountingOverviewPage } from "@/pages/accounting";
import { HesapPlaniPage } from "@/pages/accounting/hesap-plani";
import { YevmiyePage } from "@/pages/accounting/yevmiye";
import { MutabakatPage } from "@/pages/accounting/mutabakat";
import { FinancialStatementsOverviewPage } from "@/pages/financial-statements";
import { PnlPage } from "@/pages/financial-statements/pnl";
import { BilancoPage } from "@/pages/financial-statements/bilanco";
import { NakitAkisiPage } from "@/pages/financial-statements/nakit-akisi";

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
      { path: "/", element: <FoxOverviewPage /> },
      { path: "/fox", element: <FoxOverviewPage /> },
      { path: "/fox/scope1", element: <FoxScope1Page /> },
      { path: "/fox/scope2", element: <FoxScope2Page /> },
      { path: "/fox/scope3", element: <FoxScope3Page /> },
      { path: "/accounting", element: <AccountingOverviewPage /> },
      { path: "/accounting/hesap-plani", element: <HesapPlaniPage /> },
      { path: "/accounting/yevmiye", element: <YevmiyePage /> },
      { path: "/accounting/mutabakat", element: <MutabakatPage /> },
      { path: "/financial-statements", element: <FinancialStatementsOverviewPage /> },
      { path: "/financial-statements/pnl", element: <PnlPage /> },
      { path: "/financial-statements/bilanco", element: <BilancoPage /> },
      { path: "/financial-statements/nakit-akisi", element: <NakitAkisiPage /> },
    ],
  },
]);
