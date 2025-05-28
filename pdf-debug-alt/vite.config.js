import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    open: true, // Ensure browser opens
  },
  optimizeDeps: {
    include: ["react", "react-dom", "viem/chains"],
    esbuildOptions: {
      target: "es2020",
    },
  },
  define: {
    "process.env": {},
    global: {},
  },
});

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";

// export default defineConfig({
//   plugins: [react()],
//   optimizeDeps: {
//     include: ["react", "react-dom", "viem/chains"],
//     // ...Object.keys(customChains),
//   },
//   resolve: {
//     alias: {
//       // Force Vite to use chain definitions
//       "viem/chains": path.resolve(
//         __dirname,
//         "./node_modules/viem/chains/index.js"
//       ),
//     },
//   },
//   esbuild: {
//     target: "es2020", // Add this to handle modern JS features
//   },
// });
