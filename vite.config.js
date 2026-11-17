import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" keeps asset paths relative so the build works from any sub-folder (e.g. GitHub Pages)
export default defineConfig({
  base: "./",
  plugins: [react()],
});
