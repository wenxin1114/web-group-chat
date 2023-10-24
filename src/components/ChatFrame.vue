<script setup>
import { ref, reactive, nextTick, watch, getCurrentInstance, onMounted } from 'vue'
import ChatMessage from './ChatMessage.vue';
import { getMsgRecord } from '../utils';
import Message from './Message/index'
const { proxy } = getCurrentInstance()
const userList = ref(proxy.$store.state.userList)
const sendFrom = reactive({
    sendUser: null,
    content: '',
    contentType: 0
})
const msgList = ref(proxy.$store.state.msgList)
const scrollContainer = ref(null);
// 监听消息数组长度
watch(() => proxy.$store.state.msgList.length, () => {
    nextTick(() => {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    })
})
// 发送消息
const sendMessage = () => {
    if (sendFrom.content !== "") {
        sendFrom.sendUser = proxy.$store.state.user.id
        proxy.$axios.post("/chat/msg/send", sendFrom).then(resp => {
            const { code, message, data } = resp.data
            if (code === 200) {
                // 发送成功
                console.log(message)
            }
        }).catch(error => {
            Message('消息发送接口异常', 'warning')
        })
        sendFrom.content = ''
    }
}


const handleWheel = (event) => {
    if (scrollContainer.value.scrollTop === 0 && event.deltaY < 0) {
        // 聊天窗口已到达顶部并且还向上滚动
        getMsgRecord()
    }
}

</script>

<template>
    <div class="container">
        <div class="chat_frame" ref="scrollContainer" @wheel="handleWheel">
            <div class="chat">
                <div v-if="msgList" style="padding: 0;" v-for="msg in msgList" :key="msg.id">
                    <ChatMessage :message="msg" :userList="userList"></ChatMessage>
                </div>
            </div>
        </div>

        <div class="send_box" @keydown.enter="sendMessage"  @keydown.enter.prevent>
            <textarea ref="myTextarea" v-model="sendFrom.content"></textarea>
            <div class="toolbar">
                <span>
                    <icon-smiling-face class="icon" size="20" theme="two-tone" :fill="['#429e9e', '#a8e6f0']"
                        :strokeWidth="3" />
                </span>
                <span>
                    <icon-pic class="icon" theme="two-tone" size="20" :fill="['#429e9e', '#a8e6f0']" :strokeWidth="3" />
                </span>
                <span>
                    <icon-folder-upload class="icon" size="20" theme="two-tone" :fill="['#429e9e', '#a8e6f0']"
                        :strokeWidth="3" />
                </span>
                <span @click="sendMessage">
                    <icon-send class="icon" theme="two-tone" size="20" :fill="['#429e9e', '#a8e6f0']" :strokeWidth="3" />
                </span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
}

.chat_frame {
    width: 100%;
    height: 100%;
    background-color: #efeded;
    border-radius: 15px 15px 0 0;
    overflow-y: auto;
}

.chat {
    padding-left: 10px;
    padding-right: 10px;
}

.chat_frame::-webkit-scrollbar {
    width: 5px;
}

.chat_frame::-webkit-scrollbar-track {
    /* 滚动条背景颜色 */
    background-color: transparent;
    border-radius: 15px;
    /* 设置滚动条的圆角 */

}

.chat_frame::-webkit-scrollbar-thumb {
    /* 滚动条滑块颜色 */
    background-color: #3c6fdd;
    border-radius: 15px;
    /* 设置滚动条的圆角 */
    cursor: pointer;

}

.chat_frame::-webkit-scrollbar-thumb:hover {
    /* 鼠标悬停时滚动条滑块颜色 */
    background-color: #dfd61c;

}

.send_box {
    width: 100%;
    background-color: #efeded;
    border-top: 1px solid #cdc5c5;
    border-radius: 0 0 15px 15px;
    display: flex;
    align-items: center;
}


.send_box textarea {
    flex-grow: 1;
    border: none;
    outline: none;
    resize: none;
    padding: 4px;
    background-color: #fff;
    font-size: 18px;
    height: auto;
    border-radius: 10px;
    color: #000000;
    box-sizing: border-box;
}

.send_box textarea:focus {
    border: 1px solid #1078e8;
}

.toolbar {
    display: flex;
    flex-shrink: 0;
    flex-basis: auto;
}

span {
    /* margin: 0 5px; */
    padding: 5px;
}

span:hover {
    border: 1px solid #1078e8;
}


.icon {
    box-sizing: border-box;

}

.icon:hover {
    border: none;
}
</style>