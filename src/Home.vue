<template>
  <div class="container">
    <div style="font-size: large;margin-left: 10px;">Hello，有什么问题随便问哦😊</div>
    <div class="chat-window" ref="chatWindow">
      <div class="chat-bubble" v-for="(message, index) in messages" :key="index"
        :class="{'me': message.role === 'user'}">
        <div v-html="message.content"></div>
      </div>
    </div>

    <div class="input-container" style="display: flex; align-items: center;">
      <el-input type="textarea" size="large"
       style="flex: 1;border-radius: 10px;" 
       :autosize="{ minRows: 2, maxRows: 6 }" 
       v-model="question"
        placeholder="请输入您的问题..." @keydown.enter.native="ask"></el-input>

      <el-button circle :icon="Promotion" style="margin-left:25px" type="primary" @click="ask"
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
  import { ElInput, ElButton } from 'element-plus'
  import { Check, Delete, Promotion } from '@element-plus/icons-vue'
  // <el-icon><Promotion /></el-icon>
  // export default {
  //   components: {
  //     ElInput,
  //     ElButton,
  //   },
  //   setup() {
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

    const source = new EventSource(`http://180.184.92.218:5700/chat4?question=${JSON.stringify(messages.value)}`)
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
  .el-textarea__inner {
    width: 100%;
    font-size: 17px;
    border-radius: 8px;
  }

  .container {
    max-width: 600px;
    margin: 0 auto;
    background-color: #fff;
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
    padding: 10px;
    margin-bottom: 20px;
  }

  .chat-bubble {
    background-color: #f1f0f0;
    border-radius: 10px;
    padding: 8px 8px;
    max-width: 80%;
    align-self: flex-start;
    margin-bottom: 10px;
  }

  .chat-bubble.me {
    background-color: #0084ff;
    color: #fff;
    align-self: flex-end;
  }
</style>