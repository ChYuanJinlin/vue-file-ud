<template>
  <div>
    <FileUD3
      action="http://main-ui.u56.fun/api/movie/upload/picture"
      type="up"
      startDrag
      v-model="list"
      ref="FileUD3Ref"
      :autoUpload="false"
      :resProps="{ url: 'content', fileName: 'content' }"
      :headers="{
        authorization:
          'eyJhbGciOiJIUzUxMiJ9.eyJ1aWQiOiI2ODJiMGM3Yzc5ZmY0YjI0OGYwN2JmNmMiLCJ0b2tlbiI6ImJiODAxOWM2NjMzNTRjYTBhODdkNjc3NzZiZGMzNTg1IiwiaXNzIjoiZWNoaXNhbiIsInN1YiI6ImFkbWluIiwiaWF0IjoxNzUxMzQwMTcyLCJleHAiOjE3NTM5MzIxNzJ9.Xsa3z9GmOigxOOUpb4v83pEu2EdoJMoTT-HCzuWBfrhJwpiuDX7wxqN36chzDNQTZh2G8-ffROauD1wOPVJoUg',
      }"
    />

    <el-button @click="submit">提交</el-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import FileUD3 from "@/compoents/FileUD3";
import deleteIcon from "@/images/delete-icon.png";
const FileUD3Ref = ref(null);
const list = ref([
  {
    url: deleteIcon,
    fileName: "测试测试测",
    fileSize: 1945.6,
    status: "pending",
    percent: 10,
  },
  {
    url: deleteIcon,
    fileName: "测试测试测",
    fileSize: 1945.6,
  },
]);

const submit = async () => {
  await FileUD3Ref.value.submit();
  console.log("111");
};
</script>

<style scoped></style>
