import { defineConfig, loadEnv } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendUrl = env.BACKEND_URL || "http://localhost:3001";

  const tunnelExtraHosts = (env.TUNNEL_EXTRA_ALLOWED_HOSTS || "")
    .split(",")
    .map((h) => h.trim())
    .filter(Boolean);

  /** Cloudflare Quick Tunnel (*.trycloudflare.com); ngrok free (*.ngrok-free.dev); mais: TUNNEL_EXTRA_ALLOWED_HOSTS */
  const allowedHosts = [".trycloudflare.com", ".ngrok-free.dev", ...tunnelExtraHosts];

  return {
    /** Expõe BACKEND_URL do .env no cliente (import.meta.env.BACKEND_URL) */
    envPrefix: ["VITE_", "BACKEND_"],
    server: {
      allowedHosts,
      proxy: {
        "/lead": {
          target: backendUrl,
          changeOrigin: true,
        },
      },
    },
    preview: {
      allowedHosts,
    },
  };
});
