import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    open: true, // Ensure browser opens
  },
  optimizeDeps: {
    include: ["@ethsign/sp-sdk", "react", "react-dom", "viem/chains", "buffer"],
    esbuildOptions: {
      target: "es2020",
      define: {
        global: "globalThis", // Required for Buffer polyfill to work
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
        }),
      ],
    },
  },
  define: {
    "process.env": {},
    global: {},
  },
  resolve: { alias: { buffer: "buffer" } },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
