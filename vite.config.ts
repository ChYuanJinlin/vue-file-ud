import { fileURLToPath, URL } from "node:url";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { viteStaticCopy } from "vite-plugin-static-copy";
import { readFileSync } from "node:fs";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import { resolve } from "path";
const pkg = JSON.parse(
  readFileSync(resolve(process.cwd(), "package.json"), "utf-8")
);

const banner = `/*!
 * @license
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author ?? ""}
 * Released under the ${pkg.license ?? "MIT"} License.
 */`;
// https://vite.dev/config/
export default defineConfig({
  define: {
    __VERSION__: JSON.stringify(pkg.version), // 把占位符替成真实版本
  },
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [
        ElementPlusResolver({ importStyle: false }), // ← 关键
      ],
      dts: true,
    }),
    viteStaticCopy({
      targets: [
        {
          src: "src/components/images/*", // 源目录/文件
          dest: "images", // dist 里放哪里
        },
      ],
    }),
    dts({
      tsconfigPath: "./tsconfig.build.json",
      copyDtsFiles: true,
      include: ["src/**/*.vue", "src/**/*.ts"],
      beforeWriteFile: (path, content) =>
        path.endsWith("index.d.ts")
          ? { path, content: banner + "\n" + content }
          : { path, content },
      rollupTypes: true,
      insertTypesEntry: true, // 生成单文件 index.d.ts
    }),
  ],
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
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "fileUD", // 全局变量名（UMD）
      fileName: (format) => `vue3-file-ud.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        banner,
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
    extensions: [".js", ".json", ".ts", ".vue"], // 添加 .vue 扩展名
  },
});
