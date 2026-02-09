import path from "path";
import { readFileSync, existsSync } from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { defineConfig } from "vite";

// .dev.vars dosyasından worker secret'larını yükle
// @cloudflare/vite-plugin sadece VITE_ prefixli değişkenleri geçiriyor,
// bu workaround non-VITE_ değişkenleri de process.env'ye yükler
function loadDevVars() {
  const devVarsPath = path.resolve(__dirname, ".dev.vars");
  if (!existsSync(devVarsPath)) return;
  for (const line of readFileSync(devVarsPath, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const eq = t.indexOf("=");
    if (eq === -1) continue;
    const key = t.slice(0, eq).trim();
    const val = t.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDevVars();

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src/client"),
    },
    dedupe: ["react", "react-dom", "react-is"],
  },
});
