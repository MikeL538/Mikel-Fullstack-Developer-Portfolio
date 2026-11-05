import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  define: { "import.meta.env.VITE_BUILD_YEAR": JSON.stringify(String(new Date().getFullYear())) },
  base: "/",
});
