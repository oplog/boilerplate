// Login sayfası - Kinde auth ile giriş
// Giriş yapmış kullanıcılar anasayfaya yönlendirilir

import { Navigate } from "react-router-dom";
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";
import { Button } from "@/components/ui/button";
import { Loader2, LogIn } from "lucide-react";

export function LoginPage() {
  const { login, isAuthenticated, isLoading } = useKindeAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-primary">
            <img src="/OPLOG.png" alt="OPLOG" className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">OPLOG</h1>
          <p className="text-sm text-muted-foreground">
            Devam etmek için şirket hesabınızla giriş yapın
          </p>
        </div>
        <Button size="lg" className="w-full max-w-xs" onClick={() => login()}>
          <LogIn className="mr-2 h-4 w-4" />
          Giriş Yap
        </Button>
      </div>
    </div>
  );
}
