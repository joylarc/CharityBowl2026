import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/CharityBowl2026/",
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
