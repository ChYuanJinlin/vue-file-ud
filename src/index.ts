import type { App } from "vue";
import FileUD3 from "@/components/FileUD3.vue";
import type { installOptions } from "@/types/index";
export type * from '@/types/index' 
const fileUD3Plugin = {
  install(app: App, options?: installOptions) {
    app.provide("fileUDIcons", options);
    app.component("file-ud3", FileUD3);
  },
  version: "__VERSION__",
};
// 支持 app.use(FileUD3) 全局注册

export { FileUD3, fileUD3Plugin };
