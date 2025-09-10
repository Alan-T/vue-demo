import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 配置
  base:
    process.env.NODE_ENV === "production"
      ? "/vue-demo/" // 替换为实际的仓库名
      : "/",
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@stores": path.resolve(__dirname, "src/stores"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
  server: {
    port: 3313,
  },
});
