// /api/me - Oturum acmis kullanici bilgisi
// Cloudflare Zero Trust JWT'sinden cikarilan kullanici verilerini dondurur

import { Hono } from "hono";
import type { UserContext } from "../middleware/auth";

const app = new Hono<{ Variables: { user: UserContext } }>().get("/", (c) => {
  const user = c.get("user");
  return c.json(user);
});

export default app;
