import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import { FileUD3, fileUD3Plugin } from "./index";
// 创建 Vue 应用实例
const app = createApp(App);
app.use(router);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

const modulesWithBase = import.meta.glob("./images/*-icon.png", {
  import: "default",
  eager: true,
});
app.use(fileUD3Plugin, { icons: modulesWithBase, base: "./images/*-icon.png" });
// 挂载根组件
app.mount("#app");
