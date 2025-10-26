import { defineConfig } from "vite";

export default defineConfig({
  root: __dirname,
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5174",
        changeOrigin: true,
      },
    },
  },
  preview: { port: 5173 },
});
