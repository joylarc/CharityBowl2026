import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  build: {
    rollupOptions: {
      input: {
        main: "index.html",
        info: "info.html",
        results2025: "results2025.html",
      },
    },
  },
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: "*.txt",
          dest: ".",
        },
        {
          src: "*.csv",
          dest: ".",
        },
      ],
    }),
  ],
});
