<!-- @format -->

<!--
 * @Author: 袁金林 yuanjinlin@guishangyi.cn
 * @Date: 2023-06-09 15:20:45
 * @LastEditors: Jin 1075360356@qq.com
 * @LastEditTime: 2025-09-17 18:32:20
 * @FilePath: \code\gsy-mall-control-frontend\src\components\FileUD\index.vue
 * @Description: 用于上传和下载组件
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
-->
<template>
  <div class="file-ud">
    <slot name="tip">
      <div class="file-ud-tips" v-if="_tips">{{ _tips }}</div>
    </slot>

    <div
      class="file-ud-file flex flex-wrap-wrap"
      @dragover.prevent="handleDragOver"
      @dragleave="handleDragLeave"
      @drop="startDrag && type != 'down' && handleDrop($event)"
    >
      <input
        type="file"
        hidden
        ref="file"
        multiple
        :onchange="changeFile"
        :accept="props.accept"
        v-bind="$attrs"
      />

      <transition-group
        name="el-fade-in-linear"
        class="flex flex-wrap-wrap file-box"
        v-if="props.showFileList"
        tag="div"
      >
        <div
          class="item flex align-items-center"
          v-if="value.length"
          v-for="(item, index) in value"
          :key="index"
        >
          <slot name="list" :file="item">
            <div class="left flex1 flex align-items-center">
              <el-tooltip effect="dark" content="点击预览">
                <div class="left-img">
                  <div @click.stop="preview(item)">
                    <el-image :src="getImg(item)"> </el-image>
                  </div>
                </div>
              </el-tooltip>
              <el-image-viewer
                v-if="item.showPreview"
                :url-list="[item.url]"
                @close="item.showPreview = false"
              />
              <div class="left-content line-clamp-1 flex1">
                <el-tooltip
                  effect="dark"
                  :content="
                    title || (fileProps ? item[fileProps.fileName] : '')
                  "
                >
                  <div class="name line-clamp-1">
                    {{ title || (fileProps ? item[fileProps.fileName] : "") }}
                  </div>
                </el-tooltip>
                <div class="size" v-if="fileProps && item[fileProps.fileSize]">
                  {{
                    fileProps && fileProps.fileSize
                      ? formatFileSize(item[fileProps.fileSize])
                      : ""
                  }}
                </div>
              </div>
              <div class="right" v-if="!props.disabled">
                <img
                  src="./images/delete-icon.png"
                  v-if="type == 'up'"
                  alt=""
                  srcset=""
                  @click="_remove(item, index)"
                />
                <img
                  src="./images/download-icon.png"
                  v-if="type == 'down'"
                  alt=""
                  srcset=""
                  @click="onDownload ? onDownload(item) : _download(item)"
                />
              </div>
            </div>

            <el-progress
              v-if="
                type == 'up' &&
                item.status &&
                ['pending', 'fail'].includes(item.status)
              "
              :percentage="item.percent"
              :color="customColors"
            ></el-progress>

            <div class="up-loading flex align-items-center">
              <div v-if="item.status == 'pending'">
                <span>{{
                  item.pauseUpload === "pause" ? "待上传" : "上传中"
                }}</span>
                <el-icon v-if="!item.pauseUpload" class="is-loading">
                  <Loading />
                </el-icon>
                <!-- <el-button
                  link
                  type="primary"
                  size="small"
                  @click="restUpload()"
                  >取消</el-button
                >
                <el-button
                  link
                  type="primary"
                  size="small"
                  v-if="item.status === 'pending'"
                  @click="handlePauseUpload(item)"
                  >{{ !item.pauseUpload ? "暂停" : "继续" }}</el-button
                > -->
              </div>

              <div v-else-if="item.status == 'fail'">
                <span style="color: red">上传失败</span>
                <el-button
                  link
                  type="primary"
                  size="small"
                  @click="restUpload(index)"
                  >重试</el-button
                >
              </div>
            </div>
          </slot>
        </div>
      </transition-group>
    </div>

    <div
      class="file-ud-btn"
      @click.stop="openFile"
      v-if="!props.disabled && type == 'up' && value && value.length < limit"
    >
      <slot>
        <el-button type="primary" icon="el-icon-plus">上传文件</el-button>
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { inject, ref, watch } from "vue";
import {
  getFileExtension,
  formatFileSize,
  isImageByExtensionOrDataURI,
} from "@/utils/utils";
import { ElMessage, ElMessageBox } from "element-plus";
import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import type {
  ChunksProps,
  FileObj,
  FileUD3Props,
  installOptions,
} from "@/types";

// 动态导入所有图片资源
let imageModules = (import.meta as any).glob("./images/*-icon.png", {
  eager: true,
  import: "default",
});
// 使用 withDefaults 为 props 提供默认值
const props = withDefaults(defineProps<FileUD3Props>(), {
  modelValue: () => [],
  title: "",
  fileProps: () => ({
    fileName: "fileName",
    fileSize: "fileSize",
    fileType: "fileType",
    url: "url",
  }),
  resProps: () => ({
    fileName: "fileName",
    url: "url",
  }),
  action: "",
  type: "up",
  limit: Infinity,
  fileTypes: "*",
  headers: {},
  apiName: undefined,
  fileSize: Infinity,
  showFileList: true,
  customUpload: undefined,
  autoUpload: true,
  file: "file",
  tips: "",
  startDrag: false,
  beforeUpload: undefined,
  chunksProps: null,
  chunk: false,
  onRemove: undefined,
  isAutoChunk: false,
  onDownload: undefined,
  chunkSize: 1024 * 1024 * 5, // 默认分片大小为5MB
});
const fileUDIcons = inject<installOptions>("fileUDIcons");

if (fileUDIcons?.icons) {
  imageModules = { ...imageModules, ...fileUDIcons.icons };
}

const emit = defineEmits<{
  (e: "update:modelValue", value: Array<FileObj>): void;
  (e: "uploadSuccess", res: any, fileObj: FileObj): void;
  (e: "download", item: FileObj): void;
}>();

const file = ref<HTMLInputElement | null>(null);
let uploadedChunks = 0;
let totalChunks = 0;

let chunkedUploadFn: Function | null = null;
const chunkSize = props.chunkSize || 1024 * 1024 * 5;
const _tips = ref<string>("");
const customColors: Array<{ color: string; percentage: number }> = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#5cb87a", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#67c23a", percentage: 100 },
];

const value = ref<Array<FileObj>>([]);
let uploadFileCallBack: Map<FileObj, () => Promise<any>> = new Map();

// 解析传入的 modelValue
function parseValue(newVal: Array<FileObj> | string): Array<FileObj> {
  if (typeof newVal === "string") {
    return newVal
      .split(",")
      .filter((item) => item.trim() !== "")
      .map((item) => ({
        url: item,
        fileName: item,
        File: null,
        percent: 100,
        status: "success",
      }));
  } else if (Array.isArray(newVal)) {
    return [...newVal];
  }
  return [];
}

// 监听 modelValue 的变化并更新 value
watch(
  () => props.modelValue,
  (newVal) => {
    const parsedValue = parseValue(newVal);
    value.value = parsedValue;
  },
  { deep: true, immediate: true }
);

// 设置 _tips 的值
if (props.fileTypes !== "*") {
  const fileSize = props.fileSize ?? 10;
  const fileTypes = Array.isArray(props.fileTypes)
    ? props.fileTypes.join("/")
    : props.fileTypes ?? "*";
  _tips.value = `请上传大小不超过${fileSize}M格式为${fileTypes}的文件`;
} else {
  _tips.value = props.tips || "";
}

// 预览文件
const preview = (item: FileObj) => {
  if (props.onPreview) {
    props.onPreview(item);
    return;
  }
  if (!item.url) {
    ElMessage.warning("无预览文件");
    return;
  }
  if (isImageByExtensionOrDataURI((item.url || item.fileName) ?? "")) {
    item.showPreview = true;
  } else {
    window.open(item.url, "__blank");
  }
};

// 处理拖拽事件
function handleDragOver(event: DragEvent) {
  if (!props.startDrag || props.type == "down") return;
  event.preventDefault();
  if (
    (event.target as HTMLElement).classList.contains("file-ud-file") ||
    (event.target as HTMLElement).classList.contains("file-box") ||
    (event.target as HTMLElement).classList.contains("item")
  ) {
    (event.target as HTMLElement).classList.add("drag");
  }
}

function handleDragLeave(event: DragEvent) {
  (event.target as HTMLElement).classList.remove("drag");
}

function handleDrop(event: DragEvent) {
  event.preventDefault();
  (event.target as HTMLElement).classList.remove("drag");
  const files = event.dataTransfer?.files;
  if (files) {
    changeFile({ target: { files } } as any);
  }
}

// 移除文件
function _remove(item: FileObj, index: number) {
  ElMessageBox.confirm(`是否确认删除${item.fileName}文件?`, "温馨提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      value.value.splice(index, 1);
      item.cancelTokenSource();
      emit("update:modelValue", value.value);
      if (item.File && !props.autoUpload) {
        uploadFileCallBack.delete(item);
      }
      if (props.onRemove) {
        props.onRemove(item, index);
      }
    })
    .catch(() => {});
}

// 下载文件
function _download(item: FileObj) {
  if (props.fileProps && item[props.fileProps.url]) {
    const url =
      (item[props.fileProps.url] || item.url) +
      "?" +
      `response-content-type=application/octet-stream`;
    const a = document.createElement("a");
    a.href = url;
    a.download = item[props.fileProps.fileName] || item[props.fileProps.url]; // 设置下载文件的默认名称
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// 打开文件选择器
function openFile() {
  file.value && file.value.click();
}

const uploadSuccess = async (
  fileObj: FileObj,
  fileItem: File,
  formData: FormData
) => {
  try {
    const response = await (props.axiosInstance || axios.post)(
      props.action,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          ...props.headers,
        },
        cancelToken: new axios.CancelToken((c) => {
          fileObj.cancelTokenSource = c;
        }),
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (props.onProgress) {
            props.onProgress(progressEvent, fileObj);
          }
          if (progressEvent.total) {
            let percent;
            if (props.chunk) {
              percent = Math.round(
                ((uploadedChunks * chunkSize + progressEvent.loaded) * 100) /
                  fileItem.size
              );
            } else {
              percent = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
            }

            fileObj.percent = percent;
          }
        },
      }
    );

    fileObj.status = "success";

    if (props.chunk) {
      uploadedChunks++;
      if (uploadedChunks === totalChunks) {
        uploadedChunks = 0;
        totalChunks = 0;
        console.log(`上传文件 ${fileItem.name} 完成`);
        ElMessage.success(`上传文件 ${fileItem.name} 完成`);
        return Promise.resolve();
      }
    } else {
      console.log(`上传文件 ${fileItem.name} 完成`);
      ElMessage.success(`上传文件 ${fileItem.name} 完成`);
      return Promise.resolve();
    }
    if (props.onSuccess) {
      props.onSuccess?.(response, { uploadedChunks, totalChunks }, fileObj);
      return;
    }
    if (props.fileProps && props.resProps) {
      fileObj[props.fileProps.fileName] = props.action
        ? response.data.data[props.resProps.fileName]
        : response.data[props.resProps.fileName];
      fileObj[props.fileProps.url] = props.action
        ? response.data.data[props.resProps.url]
        : response.data[props.resProps.url];
    }
  } catch (error) {
    // if (!props.chunk) {
    //   value.value = value.value.filter((item) => item.status !== "fail");
    // }
    if (fileObj.pauseUpload === "pause") {
      ElMessage.warning(` ${fileItem.name} 暂停上传中`);
    } else {
      if (axios.isCancel(error)) {
        return;
      }
      fileObj.status = "fail";
      ElMessage.error(`上传文件 ${fileItem.name} 失败`);
      console.error(`上传文件 ${fileItem.name} 失败`, error);
    }

    return Promise.reject(error);
  } finally {
    (file.value as any).value = "";
  }
};

// 上传文件
const upload = async (fileObj: FileObj, fileItem: File, index: number) => {
  fileObj.status = "pending";
  fileObj.percent = 0;
  // 分片
  if (props.isAutoChunk ? fileItem.size > props.chunkSize : props.chunk) {
    return await chunkedUpload(fileItem, fileObj);
  } else {
    let formData = new FormData();
    if (typeof props.file === "function") {
      formData = props.file(formData, value.value, index);
    } else {
      formData.append(props.file, fileItem);
    }

    try {
      await uploadSuccess(fileObj, fileItem, formData);
      return Promise.resolve();
    } catch (error) {
      chunkedUploadFn = (index: number) => {
        upload(fileObj, fileItem, index);
      };
      return Promise.reject();
    }
  }
};

const restUpload = (index: number) => {
  if (chunkedUploadFn) {
    chunkedUploadFn(index);
    chunkedUploadFn = null;
  }
};

let _index = 0;
// 选择文件
function selectFile(files: FileList) {
  Array.from(files).forEach(async (fileItem: File) => {
    const fileObj = ref<FileObj>({
      File: null,
      percent: 0,
      status: null,
      url: "",
      fileName: "",
    });
    if (props.beforeUpload) {
      try {
        const result = await props.beforeUpload(fileItem);
        if (!result) {
          return;
        }
      } catch (error) {
        return;
      }
    } else {
      if (Array.isArray(props.fileTypes)) {
        const fileName = fileItem.name.split(".");
        const fileExt = fileName[fileName.length - 1];
        const isTypeOk = props.fileTypes.indexOf(fileExt) >= 0;
        if (!isTypeOk) {
          ElMessage.error(
            `文件格式不正确, 请上传${props.fileTypes.join("/")}格式文件!`
          );
          return false;
        }
      }
      if (props.fileSize) {
        const isLt = fileItem.size / 1024 / 1024 < Number(props.fileSize);
        if (!isLt) {
          ElMessage.error(`上传文件大小不能超过 ${props.fileSize} MB!`);
          return false;
        }
      }
    }
    if (!props.fileProps) return;
    fileObj.value[props.fileProps.fileName] = fileItem.name;
    fileObj.value[props.fileProps.fileSize] = fileItem.size;
    fileObj.value[props.fileProps.fileType] = getFileExtension(fileItem.name);
    fileObj.value.File = fileItem;

    if (!props.file) return;

    if (value.value.length < props.limit) {
      value.value.push(fileObj.value);
      emit("update:modelValue", value.value);
    }

    if (props.customUpload) {
      props.customUpload(fileItem, fileObj.value);
      return;
    }
    // 预览图片
    const reader = new FileReader();
    reader.onload = (e) => {
      fileObj.value[props.fileProps.url] = e.target?.result as string;
      (file.value as any).value = "";
    };
    if (fileItem) {
      reader.readAsDataURL(fileItem);
    }
    if (!props.autoUpload) {
      // 存储文件项和上传函数引用
      uploadFileCallBack.set(fileObj.value, () =>
        upload(fileObj.value, fileItem, _index++)
      );
    } else {
      upload(fileObj.value, fileItem, _index++);
    }
  });
}

// 处理文件选择事件
function changeFile(e: { target: { files: FileList } }) {
  const files = e.target.files;
  selectFile(files);
}
/*
// If you need handlePauseUpload, uncomment and use it where needed.
const handlePauseUpload = (item: FileObj) => {
  if (!item.pauseUpload) {
    item.cancelTokenSource();
    item.pauseUpload = "pause";
  } else {
    chunkedUploadFn?.();
    item.pauseUpload = null;
  }
};
*/
// 分片上传函数
async function chunkedUpload(fileItem: File, fileObj: FileObj) {
  // 默认分片大小为5MB
  totalChunks = Math.ceil(fileItem.size / chunkSize);

  async function runChunke(currIndex = 0) {
    const formData = new FormData();
    for (let chunkIndex = currIndex; chunkIndex < totalChunks; chunkIndex++) {
      if (fileObj.pauseUpload === "cance") {
        fileObj.cancelTokenSource();
        return;
      }
      if (fileObj.pauseUpload === "pause") {
        await new Promise((resolve) => {
          const interval = setInterval(() => {
            if (!fileObj.pauseUpload) {
              clearInterval(interval);
              resolve(true);
            }
          }, 100);
        });
      }
      const start = chunkIndex * chunkSize;
      const end = Math.min(start + chunkSize, fileItem.size);
      const chunk = fileItem.slice(start, end);
      // 确保 chunksProps 存在，并且每个属性都有默认值
      const chunksProps: ChunksProps = props.chunksProps || {
        file: "file",
        chunkIndexName: "chunkIndex",
        totalChunksName: "totalChunks",
        fileName: "fileName",
        fileSizeName: "fileSize",
      };
      formData.append(chunksProps?.file, chunk);
      formData.append(chunksProps?.chunkIndexName, chunkIndex.toString());
      formData.append(chunksProps?.totalChunksName, totalChunks.toString());
      formData.append(chunksProps?.fileName, fileItem.name);
      formData.append(chunksProps?.fileSizeName, fileItem.size.toString());
      try {
        await uploadSuccess(fileObj, fileItem, formData);
      } catch (error) {
        console.error(
          `分片文件${fileItem.name}上传失败,当前分片下标${chunkIndex + 1}`
        );
        chunkedUploadFn = () => {
          fileObj.status = "pending";
          runChunke(currIndex);
        };
        throw new Error(
          `分片文件${fileItem.name}上传失败,当前分片下标${chunkIndex + 1}`
        );
      }
    }
  }
  await runChunke();
}

// 提交上传
const submit = async () => {
  if (!value.value.length) {
    ElMessage.warning("请上传文件!");
    return Promise.reject("请上传文件!");
  }
  try {
    const uploadPromises = Array.from(uploadFileCallBack.entries()).map(
      ([fileItem, uploadFunc]) => {
        return new Promise((resolve, reject) => {
          uploadFunc()
            .then(() => {
              resolve(true);
            })
            .catch((error) => {
              reject(error); // 即使上传失败，也继续执行后续的上传
            });
          uploadFileCallBack.delete(fileItem);
        });
      }
    );

    // 等待所有上传完成

    await Promise.all(uploadPromises);

    return Promise.resolve();
  } catch (error) {
    console.log("🚀 ~ submit ~ error:", error);
    return Promise.reject();
  }
};

function getImg(item: any) {
  if (!item) return "";
  const ext =
    item.fileType ||
    (item.fileName && getFileExtension(item.url || item.fileName)) ||
    "";

  const iconPath = `./images/${ext}-icon.png`;
  let base = fileUDIcons?.base?.replace("*", ext);

  if (base !== undefined) {
    base = `../../..${imageModules[base]}`;
  }
  return (
    (imageModules[base!] ? base : "") ||
    (imageModules as Record<string, string>)[iconPath] ||
    (imageModules as Record<string, string>)["./images/unknown-icon.png"] ||
    ""
  );
}

defineExpose({
  openFile,
  submit,
  chunkedUpload,
});
</script>
<style lang="scss" scoped>
/**
 * flex 布局
 **/

$primary-color: #1875ff;
$gray-light: #eeeeee;
$gray-dark: #333333;
$gray-medium: #999999;
$bg-light: #f5f5f5;

.flex {
  display: flex;
}
.line-clamp-1 {
  white-space: nowrap; /* 防止内容换行 */
  overflow: hidden; /* 隐藏超出部分 */
  text-overflow: ellipsis; /* 显示省略号 */
}
.flex-direction {
  display: flex;
  flex-direction: column;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.justify-content {
  &-start {
    justify-content: flex-start;
  }

  &-end {
    justify-content: flex-end;
  }

  &-center {
    justify-content: center;
  }

  &-between {
    justify-content: space-between;
  }

  &-around {
    justify-content: space-around;
  }

  &-evenly {
    justify-content: space-evenly;
  }

  &-stretch {
    justify-content: stretch;
  }
}

.align-items {
  &-start {
    align-items: flex-start;
  }

  &-end {
    align-items: flex-end;
  }

  &-center {
    align-items: center;
  }

  &-baseline {
    align-items: baseline;
  }

  &-stretch {
    align-items: stretch;
  }
}

.flex-wrap {
  &-nowrap {
    flex-wrap: nowrap;
  }

  &-wrap {
    flex-wrap: wrap;
  }

  &-reverse {
    flex-wrap: wrap-reverse;
  }
}

.flex1 {
  flex: 1;
}

.flex2 {
  flex: 2;
}

.flex3 {
  flex: 3;
}

.flex4 {
  flex: 4;
}

.flex5 {
  flex: 5;
}

:deep(.image-slot) {
  width: 45px;
  height: 45px;
  background: $gray-light;
  margin-bottom: 10px;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
.list-leave-active {
  position: absolute;
}

:deep(.el-progress) {
  position: absolute;
  bottom: -3px;
  left: 2px;

  right: -1px;
  .el-progress__text {
    transform: translate(-3px, -3px);
    min-width: auto;
  }
}

.drag {
  font-size: 16px;
  cursor: pointer;
  background: rgba($primary-color, 0.1);
  border: 2px dashed $primary-color;
}

.file-ud {
  .file-ud-tips {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: $gray-medium;
    line-height: 1;
    padding-top: 12px;
    padding-bottom: 10px;
  }

  :deep(.el-form-item) {
    margin-bottom: 0;

    .el-form-item__label {
      line-height: 0;
      font-size: 16px;
    }
  }

  .file-ud-btn {
    width: fit-content;
    :deep(.el-button) {
      height: 40px;
      background: $primary-color;
      border-radius: 5px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      padding: 10px 60px;
    }
  }

  .file-ud-file {
    .item {
      width: 351px;
      height: 68px;
      background: $bg-light;
      border-radius: 6px;
      padding: 0 12px;
      margin-right: 30px;
      flex: none;
      position: relative;
      overflow: hidden;
      margin-bottom: 12px;

      .up-loading {
        position: absolute;
        top: 0;
        right: 7px;
        font-size: 12px;
        font-weight: bold;
        color: $primary-color;
      }

      .left {
        width: 100%;
        .left-img {
          :deep(.el-image) {
            img {
              width: 44px;
              height: 44px;
              vertical-align: middle;
              cursor: pointer;
            }
          }

          margin-right: 10px;
        }

        .left-content {
          line-height: 19px;
          padding-bottom: 1px;
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $gray-dark;
          padding-bottom: 1px;
          padding-right: 15px;
        }

        .size {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: $gray-medium;
        }
      }

      .right {
        img {
          width: 18px;
          height: 18px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
