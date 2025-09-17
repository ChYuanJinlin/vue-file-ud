# fileud-upload

一个基于 Vue3 的大文件上传/下载，拖拽、进度、类型/大小校验等功能。

## 安装

```bash
npm install vue3-fileUD
```

## 使用

```js
import FileUD from "vue3-file-ud";
// 在你的 Vue 组件中注册并使用
```

```vue
<FileUD v-model="fileList" :action="uploadUrl" />
```

## Props

- modelValue / v-model：文件列表
- action：上传地址
- fileTypes：允许的文件类型
- fileSize：文件大小限制（MB）
- limit：最大数量
- ...（详见源码）

## 事件

- uploadSuccess
- download

## 说明

- 依赖 vue3、element-plus
- 支持 TypeScript

---

如需更多用法和自定义，请参考源码。
