import { App } from "vue";
import FileUD3 from "./compoents/FileUD3.vue";
// @ts-ignore: If using Vue 2, App type may not exist; fallback to any

// 支持 app.use(FileUD3) 全局注册
FileUD3.install = (app: App) => {
  app.component("FileUD3", FileUD3);
};

export default FileUD3;
export { FileUD3 };
