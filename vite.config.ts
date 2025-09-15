import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log("🚀 ~ __dirname:", __dirname)

export default defineConfig({
  // 开发服务器配置
  server: {
    port: 3001, // 开发服务器端口
    host: "0.0.0.0", // 允许外部访问
    open: true, // 自动打开浏览器
    proxy: {
      // 代理配置
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },

  // 构建配置
  build: {
    rollupOptions: {
      external: ["vue", "element-plus"],
      output: {
        globals: {
          vue: "Vue",
          "element-plus": "ElementPlus",
        },
      },
    },
  },

  // 插件配置
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],

  // 别名配置
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
    extensions: [".js", ".json", ".ts", ".vue"], // 添加 .vue 扩展名
  },
});
