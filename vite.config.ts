import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This forces Vite to provide the 'global' variable which is needed by matrix-crdt
    global: "globalThis",
  },
});
