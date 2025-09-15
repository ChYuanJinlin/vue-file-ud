/** @format */

import { AxiosInstance } from "axios";

// 定义 FileObj 类型，表示单个文件对象，扩展自 Record<string, any> 接口
export declare interface FileObj extends Record<string, any> {
  url: string; // 文件的访问URL
  fileName: string; // 文件的名称
  File: File | null; // 文件对象，类型为 File 或者 null
  percent: number; // 文件上传的进度百分比
  status: "pending" | "success" | "fail" | null; // 文件的状态，如 'uploading', 'success', 'error' 等
}
export declare interface installOptions {
  icons?: Record<string, unknown>;
  base?: string;
}
// 定义 FileProps 类型，表示文件的属性
export declare interface FileProps {
  fileName: string; // 文件名
  fileSize: string; // 文件大小，通常以字节为单位
  fileType: string; // 文件类型，如 'image/jpeg'
  url: string; // 文件的访问URL
}

// 定义 ResProps 类型，表示上传成功后返回的响应属性
export declare interface ResProps {
  fileName: string; // 成功上传后的文件名
  url: string; // 成功上传后的文件访问URL
}
export interface ChunksProps {
  file: string;
  chunkIndexName: string;
  totalChunksName: string;
  fileName: string;
  fileSizeName: string;
}
export interface Chunks {
  uploadedChunks?: number;
  totalChunks?: number;
}
// 定义 props 的类型，表示组件的属性
export declare interface FileUD3Props {
  modelValue: Array<FileObj> | string; // 绑定的文件列表，类型为 FileObj 数组或字符串
  title?: string; // 组件的标题
  fileProps?: FileProps; // 文件的属性
  resProps?: ResProps; // 上传成功后返回的响应属性
  action: string; // 上传的地址
  headers?: any; // 上传请求的头部信息
  type?: string; // 上传的类型
  axiosInstance?: AxiosInstance;
  accept?: string; // 接受的文件类型
  limit?: number; // 上传文件的数量限制
  fileTypes?: string | string[]; // 接受的文件类型列表
  showFileList?: boolean; // 是否显示已上传的文件列表
  beforeUpload?: (fileItem: File) => Promise<boolean> | boolean | undefined; // 上传前的钩子函数
  onProgress?: (progressEvent: AxiosProgressEvent, fileObj: FileObj) => void; // 上传进度的回调函数
  fileSize?: number | string; // 文件大小限制
  disabled?: boolean; // 是否禁用上传功能
  onSuccess?: (res: any, chunks: Chunks, fileObj: FileObj) => void; // 上传成功的回调函数
  customUpload?: (fileItem: File, FileObj: FileObj) => void; // 自定义上传逻辑
  file?:
    | string
    | ((formData: FormData, value: FileObj[], index: number) => FormData); // 文件字段的名称
  autoUpload?: boolean; // 是否自动上传
  tips?: string; // 提示信息
  startDrag?: boolean; // 是否启用拖拽上传
  onRemove?: (item: FileObj, index: number) => void; // 移除文件的回调函数
  chunk?: boolean; //分片上传
  isAutoChunk?: boolean; //是否chunkSize根据文件大小自动分片上传,
  chunkSize?: number; // 分片大小;
  chunksProps?: ChunksProps | null; // 是否分片上传
  onDownload?: (item: FileObj) => void; // 下载文件的回调函数
  onPreview?: (item: FileObj) => void; // 预览回调函数
}
