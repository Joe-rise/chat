<template>
  <div class="container">
    <div style="font-size: large;margin-left: 10px;">Hello，有什么问题随便问哦😊</div>
    <div class="chat-window" ref="chatWindow">
      <div class="chat-item"  v-for="(message, index) in messages" :key="index" :class="{'user': message.role === 'user'}">


          <div class="avatar" v-if="message.role === 'assistant'">
            <el-avatar :size="avatarSize" :src="robotAvatar" />
          </div>
          <div class="avatar" v-if="message.role === 'user'">
            <el-avatar :size="avatarSize" :src="userAvatar" />
          </div>
          <div class="chat-bubble" :class="{'me': message.role === 'user'}">
            <div v-html="message.content"></div>
          </div>

      </div>
    </div>

    <div class="input-container" style="display: flex; align-items: center;">
      <el-input type="textarea" size="large" style="flex: 1" :autosize="{ minRows: 2, maxRows: 6 }"
        v-model="question" placeholder="请输入您的问题..." @keydown.enter.native="ask"></el-input>

      <el-button circle :icon="Promotion" style="margin-left:10px" type="primary" @click="ask"
        :disabled="question.trim() === ''"></el-button>

      <el-popconfirm title="是否清空历史聊天内容?" :hide-icon="true" :hide-after="0" @confirm="clearMessages">
        <template #reference>
          <el-button circle :icon="Delete" type="warning" style="margin-left:8px"></el-button>
        </template>
      </el-popconfirm>

    </div>
  </div>
</template>

<script setup>
  import { ref, watch } from 'vue'
  import {  Delete, Promotion } from '@element-plus/icons-vue'
  const chatWindow = ref(null)
  const question = ref('')
  const messages = ref([])

  const savedMessages = localStorage.getItem('messages')
  const savedQuestion = localStorage.getItem('question')
  if (savedMessages) {
    messages.value = JSON.parse(savedMessages)
  }
  if (savedQuestion) {
    question.value = savedQuestion
  }
  const avatarSize = 35
  const userAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
  const robotAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

  function saveQuestion() {
    localStorage.setItem('question', question.value)
  }

  watch(question, () => {
    saveQuestion()
  })

  function clearMessages() {
    messages.value = []
    localStorage.removeItem('messages')
  }

  function ask() {

    const chatBubbleMe = { role: 'user', content: question.value }
    messages.value.push(chatBubbleMe)
    localStorage.setItem('messages', JSON.stringify(messages.value))

    const source = new EventSource(`http://180.184.92.218:60088/chat4?question=${JSON.stringify(messages.value)}`)
    const chatBubbleBot = { role: 'assistant', content: '' }
    messages.value.push(chatBubbleBot)
    question.value = ''
    source.onmessage = function (event) {
      if (event.data == '[DONE]') {
        source.close()
        localStorage.setItem('messages', JSON.stringify(messages.value))
      } else {
        messages.value[messages.value.length - 1].content += event.data
      }
    }
    question.value = ''
  }

</script>

<style>
  .user{
    flex-direction: row-reverse;
  }
  
  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #ededed;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    padding: 3px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    height: 97vh;
  }
  
  .chat-window {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }
  
  .chat-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 10px;
  }
  
  .chat-item .user{
    /* display: flex; */
    justify-content: flex-end;
  }
  

  .chat-bubble {
    background-color: #ffffff;
    border-radius: 10px;
    padding: 8px 8px;
    max-width: 70%;
    margin-left: 10px;
    margin-right: 10px;
    /* align-self: flex-start; */
  }

  .chat-bubble.me {
    background-color: #4bc766;
    color: #fff;
    align-self: flex-end;
  }
</style>