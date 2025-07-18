// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
// import rollupNodePolyFill from "rollup-plugin-node-polyfills";

// export default defineConfig({
//   plugins: [react()],
//   base: "/",
//   server: {
//     open: true, // Ensure browser opens
//   },
//   optimizeDeps: {
//     include: ["@ethsign/sp-sdk", "react", "react-dom", "viem/chains", "buffer"],
//     esbuildOptions: {
//       target: "es2020",
//       define: {
//         global: "globalThis", // Required for Buffer polyfill to work
//       },
//       plugins: [
//         NodeGlobalsPolyfillPlugin({
//           buffer: true,
//         }),
//       ],
//     },
//   },
//   define: {
//     "process.env": {},
//     global: {},
//   },
//   resolve: { alias: { buffer: "buffer" } },
//   build: {
//     rollupOptions: {
//       plugins: [rollupNodePolyFill()],
//     },
//   },
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import rollupNodePolyFill from "rollup-plugin-node-polyfills";

export default defineConfig({
  plugins: [react()],
  base: "/",
  define: {
    global: "globalThis",
    "process.env": {},
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
      plugins: [
        NodeGlobalsPolyfillPlugin({
          buffer: true,
          process: true,
        }),
        NodeModulesPolyfillPlugin(),
      ],
    },
  },
  resolve: {
    alias: {
      buffer: "buffer",
      process: "process/browser",
    },
  },
  build: {
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
});
