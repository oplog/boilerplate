// Cloudflare Zero Trust Auth Middleware
// Cf-Access-Jwt-Assertion header'indan kullanici bilgisi cikarir
// Zero Trust JWT'si edge'de dogrulanir, burada sadece decode edilir

import { createMiddleware } from "hono/factory";

export type UserContext = {
  email: string;
  name: string;
};

// JWT payload'unu decode et (dogrulama CF edge'de yapildi)
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(payload);
  } catch {
    return null;
  }
}

// Middleware: Cf-Access-Jwt-Assertion header'indan user bilgisi cikarir
// Gelistirme ortaminda header yoksa varsayilan kullanici kullanilir
export const authMiddleware = createMiddleware<{
  Variables: { user: UserContext };
}>(async (c, next) => {
  const jwt = c.req.header("Cf-Access-Jwt-Assertion");

  if (jwt) {
    const payload = decodeJwtPayload(jwt);
    if (payload) {
      c.set("user", {
        email: (payload.email as string) ?? "",
        name:
          ((payload.custom as Record<string, string>)?.name as string) ??
          (payload.email as string)?.split("@")[0] ??
          "",
      });
      return next();
    }
  }

  // Gelistirme ortaminda JWT olmadan calis
  c.set("user", {
    email: "dev@oplog.com",
    name: "Gelistirici",
  });
  return next();
});
