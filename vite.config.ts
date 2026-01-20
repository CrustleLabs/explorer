import {defineConfig} from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

export default defineConfig(() => {
  return {
    build: {
      outDir: "build",
      sourcemap: true,
    },
    // in addition to the default VITE_ prefix, also support REACT_APP_ prefixed environment variables for compatibility reasons with legacy create-react-app.
    envPrefix: ["VITE_", "REACT_APP_"],
    plugins: [react(), svgr()],
    server: {
      proxy: {
        "/v1/graphql": {
          target: "https://devnet-storage.crustle.xyz",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
