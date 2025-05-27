import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  build: {
    // Optimize chunk sizes
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries
          vendor: ["react", "react-dom"],
          three: ["three", "@react-three/fiber", "@react-three/drei"],
          // Separate large city data files
          cityData: ["./src/cityData.ts"],
        },
      },
    },
    // Enable source maps for debugging
    sourcemap: true,
    // Optimize for production
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
  },
  // Optimize dev server
  server: {
    port: 5173,
    host: true, // Allow external connections
  },
  // Performance optimizations
  optimizeDeps: {
    include: ["react", "react-dom", "three"],
  },
});
