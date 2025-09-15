import { App } from "vue";
import FileUD3 from "./compoents/FileUD3.vue";
import { installOptions } from "./types";
// @ts-ignore: If using Vue 2, App type may not exist; fallback to any
const fileUD3Plugin = {
  install(app: App, options?: installOptions) {

    app.provide("fileUDIcons", options);
    app.component("file-ud3", FileUD3);
  },
};
// 支持 app.use(FileUD3) 全局注册

export { FileUD3, fileUD3Plugin };
