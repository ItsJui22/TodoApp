import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // 🔑 eta add korle dev server run korle auto browser open hobe
    port: 5173,
  },
});
