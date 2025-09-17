/*!
 * @license
 * vue3-file-ud v1.0.2
 * (c) 2025 袁金林 <1075360356@qq.com>
 * Released under the MIT License.
 */
import { App } from 'vue';
import { AxiosInstance } from 'axios';
import { AxiosProgressEvent } from 'axios';
import { ComponentOptionsMixin } from 'vue';
import { ComponentProvideOptions } from 'vue';
import { DefineComponent } from 'vue';
import { PublicProps } from 'vue';

declare const __VLS_component: DefineComponent<FileUD3Props, {
openFile: typeof openFile;
submit: () => Promise<void>;
chunkedUpload: typeof chunkedUpload;
}, {}, {}, {}, ComponentOptionsMixin, ComponentOptionsMixin, {} & {
"update:modelValue": (value: FileObj[]) => any;
uploadSuccess: (res: any, fileObj: FileObj) => any;
download: (item: FileObj) => any;
}, string, PublicProps, Readonly<FileUD3Props> & Readonly<{
"onUpdate:modelValue"?: ((value: FileObj[]) => any) | undefined;
onUploadSuccess?: ((res: any, fileObj: FileObj) => any) | undefined;
onDownload?: ((item: FileObj) => any) | undefined;
}>, {
modelValue: Array<FileObj> | string;
title: string;
fileProps: FileProps;
resProps: ResProps;
action: string;
headers: any;
type: string;
limit: number;
fileTypes: string | string[];
showFileList: boolean;
beforeUpload: (fileItem: File) => Promise<boolean> | boolean | undefined;
fileSize: number | string;
customUpload: (fileItem: File, FileObj: FileObj) => void;
file: string | ((formData: FormData, value: FileObj[], index: number) => FormData);
autoUpload: boolean;
tips: string;
startDrag: boolean;
onRemove: (item: FileObj, index: number) => void;
chunk: boolean;
isAutoChunk: boolean;
chunkSize: number;
chunksProps: ChunksProps | null;
onDownload: (item: FileObj) => void;
}, {}, {}, {}, string, ComponentProvideOptions, false, {
file: HTMLInputElement;
}, HTMLDivElement>;

declare function __VLS_template(): {
    attrs: Partial<{}>;
    slots: {
        tip?(_: {}): any;
        list?(_: {
            file: {
                [x: string]: any;
                url?: string | undefined;
                fileName?: string | undefined;
                File?: {
                    readonly lastModified: number;
                    readonly name: string;
                    readonly webkitRelativePath: string;
                    readonly size: number;
                    readonly type: string;
                    arrayBuffer: () => Promise<ArrayBuffer>;
                    bytes: () => Promise<Uint8Array>;
                    slice: (start?: number, end?: number, contentType?: string) => Blob;
                    stream: () => ReadableStream<Uint8Array>;
                    text: () => Promise<string>;
                } | null | undefined;
                percent?: number | undefined;
                status?: "pending" | "success" | "fail" | null | undefined;
            };
        }): any;
        default?(_: {}): any;
    };
    refs: {
        file: HTMLInputElement;
    };
    rootEl: HTMLDivElement;
};

declare type __VLS_TemplateResult = ReturnType<typeof __VLS_template>;

declare type __VLS_WithTemplateSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};

declare function chunkedUpload(fileItem: File, fileObj: FileObj): Promise<void>;

export declare interface Chunks {
    uploadedChunks?: number;
    totalChunks?: number;
}

export declare interface ChunksProps {
    file: string;
    chunkIndexName: string;
    totalChunksName: string;
    fileName: string;
    fileSizeName: string;
}

export declare interface FileObj extends Record<string, any> {
    url?: string; // 文件的访问URL
    fileName?: string; // 文件的名称
    File?: File | null; // 文件对象，类型为 File 或者 null
    percent?: number; // 文件上传的进度百分比
    status?: "pending" | "success" | "fail" | null; // 文件的状态，如 'pending', 'success', 'error' 等
}

export declare interface FileProps {
    fileName: string; // 文件名
    fileSize: string; // 文件大小，通常以字节为单位
    fileType: string; // 文件类型，如 'image/jpeg'
    url: string; // 文件的访问URL
}

export declare const FileUD3: __VLS_WithTemplateSlots<typeof __VLS_component, __VLS_TemplateResult["slots"]>;

export declare const fileUD3Plugin: {
    install(app: App, options?: installOptions): void;
    version: string;
};

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

export declare interface installOptions {
    icons?: Record<string, unknown>;
    base?: string;
}

declare function openFile(): void;

export declare interface ResProps {
    fileName: string; // 成功上传后的文件名
    url: string; // 成功上传后的文件访问URL
}

export { }
