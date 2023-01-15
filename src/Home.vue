
<template>
  <b>首页</b><br>
  <el-button type="primary" @click="open"> ceshi</el-button>
  <el-button plain @click="open1"> Closes automatically </el-button>
</template>


<script setup>
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-notification.css';
import {getDayData, getDaySize} from "./api/stats.js";

const boxOfficeData = ref(null)
 onMounted(()=>{
   getDayData().then((res)=>{
     boxOfficeData.value = res.data
   });
 })


import { ElMessage } from 'element-plus'
const open = () => {
  ElMessage({
    message: 'Congrats, this is a success message.',
    type: 'success',
  })
}

import {h, onMounted, ref} from 'vue'
import { ElNotification } from 'element-plus'

const open1 = () => {
  ElNotification({
    title: 'Title',
    message: h('i', { style: 'color: teal' }, 'This is a reminder'),
  })
}
</script>

<style scoped>
</style>
