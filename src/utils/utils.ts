/*
 * @Author: 袁金林 yuanjinlin@guishangyi.cn
 * @Date: 2023-11-24 14:15:57
 * @LastEditors: 袁金林 yuanjinlin@guishangyi.cn
 * @LastEditTime: 2023-11-29 14:52:00
 * @FilePath: \code\gsy-mall-control-frontend\src\components\FileUD\utils.js
 * @Description:
 *
 * Copyright (c) 2023 by ${git_name_email}, All Rights Reserved.
 */
// 截取文件名后缀
export function getFileExtension(filename: string) {
  const parts = filename && filename.split(".");
  return parts && parts.length > 1 ? parts[parts.length - 1] : "";
}
/**
 * 将文件大小转换为易读的格式
 * @param {number} bytes - 文件大小的字节数
 * @param {number} [decimals=2] - 保留的小数位数，默认为2
 * @returns {string} 转换后的文件大小字符串
 */
export function formatFileSize(bytes: any, decimals = 2) {
  // 转换为数字
  bytes = Number(bytes);

  // 检查是否为有效数字
  if (isNaN(bytes)) return "0 Bytes";
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

export function isImageByExtensionOrDataURI(fileName: string): boolean {
  // 检查是否为 data URI 格式的图片
  if (fileName.startsWith("data:image")) {
    // 提取 MIME 类型
    const mimeType = fileName
      .substring("data:".length, fileName.indexOf(";"))
      .toLowerCase();
    // 检查 MIME 类型是否为图片类型
    const imageMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp",
      "image/tiff",
      "image/webp",
      "image/svg+xml",
    ];
    return imageMimeTypes.includes(mimeType);
  }

  // 检查文件扩展名
  const imageExtensions = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".bmp",
    ".tiff",
    ".webp",
    ".svg",
    // 添加其他图片文件扩展名
  ];
  const fileExtension = fileName
    ?.trim()
    .toLowerCase()
    .substring(fileName.lastIndexOf("."));
  return imageExtensions.includes(fileExtension);
}
