<template>
  <div class="container">
    <div class="chat-window" ref="chatWindow" id="chatroom">
      <div style="font-size: large;margin-left: 10px;">Hello，有什么问题随便问哦😊</div>
      <div class="chat-item" v-for="(message, index) in state.messages" :key="index">

        <div class="toolbox" style="padding:0px 45px 2px;" :class="{ 'user-box': message.role === 'user' }">
          <el-button-group>
            <el-button :icon="DocumentCopy" type="primary" plain :style="{ padding: '15px' }"
              @click="copyToClip(message.content)" />
            <el-button :icon="Edit" type="primary" @click="editMessage(message.content)" plain
              :style="{ padding: '15px' }" />
            <el-button :icon="Delete" type="primary" plain :style="{ padding: '15px' }" @click="deleteMessage(index)" />
          </el-button-group>
        </div>

        <div class="chat-message" :class="{ 'user': message.role === 'user' }">
          <div class="avatar" v-if="message.role === 'assistant'">
            <el-avatar :size="avatarSize" :src="robotAvatar" />
          </div>
          <div class="avatar" v-if="message.role === 'user'">
            <el-avatar :size="avatarSize" :src="userAvatar" />
          </div>
          <div class="chat-bubble" :class="{ 'user-bubble': message.role === 'user' }">
            <div v-html="message.content"></div>
          </div>
        </div>


      </div>
    </div>
    <div style="display: flex; align-items: center;justify-content:flex-end;margin-bottom: 5px;margin-right: 5px;">
      <el-popconfirm title=" 是否清空历史聊天内容?" :hide-icon="true" :hide-after="0" @confirm="clearMessages">
        <template #reference>
          <el-button circle :icon="Delete" type="warning" style="margin-left:8px"></el-button>
        </template>
      </el-popconfirm>
    </div>
    <div class="input-container" style="display: flex; align-items: center;margin-bottom: 3vh;">
      <el-input class="input" size="large" style="flex: 1" v-model="question" placeholder="请输入您的问题..."
        @keydown.enter.native="ask">
        <template #suffix>
          <el-button :icon="Promotion" style="border: none" @click="ask"></el-button>
        </template>
      </el-input>



    </div>
  </div>
</template>

<script setup>
import { ref, watch, reactive, onMounted, nextTick } from 'vue'
import { Delete, Promotion, DocumentCopy, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import 'element-plus/theme-chalk/el-message.css';
import 'element-plus/theme-chalk/el-notification.css';
const chatWindow = ref()
const question = ref('')

const state = reactive({
  messages: [],
})

function editMessage(val) {
  question.value = val
}
function copyToClip(content) {
  var aux = document.createElement("input");
  aux.setAttribute("value", content);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
  ElMessage.success("复制成功");
}

function scrollToBottom() {
  nextTick(() => {
    const chatWindowEl = chatWindow.value
    chatWindowEl.scrollTop = chatWindowEl.scrollHeight
  })
}

onMounted(() => {
  const savedMessages = localStorage.getItem('messages')
  const savedQuestion = localStorage.getItem('question')
  if (savedMessages) {
    state.messages = JSON.parse(savedMessages)
  }
  if (savedQuestion) {
    question.value = savedQuestion
  }
  scrollToBottom()
})


const avatarSize = 35
const userAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
const robotAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

function deleteMessage(index) {
  state.messages.splice(index, 1);
  localStorage.setItem('messages', JSON.stringify(state.messages))
}

function addMessage(message) {
  state.messages.push(message)
  localStorage.setItem('messages', JSON.stringify(state.messages))
}

watch(question, () => {
  localStorage.setItem('question', question.value)
})

watch(() => state.messages, () => {
  scrollToBottom()
}, {
  deep: true
})

function clearMessages() {
  state.messages = []
  localStorage.removeItem('messages')
}


async function fetchChatGPT(msg) {
  const url = 'http://180.184.92.218:60088/chat5'
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(msg),
      headers: {
        'Content-Type': 'application/json'
      },
    });
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      if (!readerDone) {
        state.messages[state.messages.length - 1].content += decoder.decode(value)
      } else {
        localStorage.setItem('messages', JSON.stringify(state.messages))
      }
      done = readerDone
    }
  } catch (error) {
    console.error(error);
  }
}



function ask() {
  if (question.value.trim().length === 0) {
    ElMessage.warning("发送消息不能为空")
    return
  }

  const chatBubbleMe = { role: 'user', content: question.value }
  addMessage(chatBubbleMe)

  fetchChatGPT(state.messages)
  const chatBubbleBot = { role: 'assistant', content: '' }
  addMessage(chatBubbleBot)
  question.value = ''
}

</script>

<style>
.el-input--large .el-input__wrapper {
  padding-right: 1px;
}

.user {
  flex-direction: row-reverse;
}

.container {
  overflow: hidden;
  max-width: 600px;
  margin: 0 auto;
  background-color: #ededed;
  padding: 3px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 2px;
}

.chat-message {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
}


.chat-bubble {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 8px 8px;
  max-width: 70%;
  margin-left: 10px;
  margin-right: 10px;
}

.chat-bubble.user-bubble {
  background-color: #4bc766;
  color: #fff;
  align-self: flex-end;
}

.chat-item:hover .toolbox {
  opacity: 1;
}

.toolbox {
  display: flex;
  opacity: 0;
}

.toolbox.user-box {
  justify-content: flex-end;
}
</style>