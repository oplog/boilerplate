// Auth Gate - Kimlik doğrulama kontrolü
// Giriş yapmamış kullanıcıları /login sayfasına yönlendirir

import { Navigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Loader2 } from "lucide-react";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useKindeAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
