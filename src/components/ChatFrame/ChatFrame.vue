<script setup>
import { useStore } from 'vuex';
import { ref, reactive, nextTick, watch, getCurrentInstance, computed } from 'vue'
import ChatMessage from '../ChatMessage/ChatMessage.vue';
import { getMsgRecord } from '../../utils';
import Message from '../Message/index';
import EmojiBox from '../EmojiBox/EmojiBox.vue';

const store = useStore()
const { proxy } = getCurrentInstance()
const emojiState = ref(false)
const sendFrom = reactive({
    sendUser: null,
    content: '',
    contentType: 0
})
const msgList = computed(() => {
    return store.state.msgList
})
const scrollContainer = ref(null);
const emojiBox = ref(null)
const emojiIcon = ref(null)
// 监听消息数组长度
watch(() => store.state.msgList.length, () => {
    nextTick(() => {
        scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight
    })
})
// 发送消息
const sendMessage = () => {
    if (sendFrom.content !== "") {
        sendFrom.sendUser = store.state.user.id
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
// 添加表情
const addEmoji = (emoji) => {
    sendFrom.content += emoji
}
// 点击窗口执行其它操作
const clickFrame = (event) => {
    if (
        emojiState.value && // 当表情栏打开时
        !emojiBox.value.$el.contains(event.target) && // 当点击不在组件内
        !emojiIcon.value.contains(event.target) // 当点击不在表情开关内
    ) {
        emojiState.value = false
    }
}
</script>

<template>
    <div class="cf-container" @click="clickFrame">
        <div class="chat_frame" ref="scrollContainer" @wheel="handleWheel">
            <div class="chat">
                <div v-for="msg in msgList" :key="msg.id">
                    <ChatMessage :message="msg"></ChatMessage>
                </div>
            </div>
        </div>
        <div class="send_box" @keydown.enter="sendMessage" @keydown.enter.prevent>
            <textarea ref="myTextarea" v-model="sendFrom.content"></textarea>
            <EmojiBox v-show="emojiState" @add-emoji="addEmoji" ref="emojiBox"></EmojiBox>
            <div class="toolbar">
                <span @click="emojiState = true" ref="emojiIcon">
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
.cf-container {
    min-width: 360px;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);

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
    position: relative;
}


.send_box textarea {
    flex-grow: 1;
    padding-left: 5px;
    border: none;
    outline: none;
    resize: none;
    background-color: #fff;
    font-size: 16px;
    font-weight: 550;
    height: auto;
    border-radius: 10px;
    color: #000000;
    margin: 0 5px;
    border-radius: 10px;
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
    padding: 8px;
    border-radius: 10px;
    transition: background-color .4s ease-in;
}

span:hover {
    background-color: aqua;
    cursor: pointer;
}

.icon {
    box-sizing: border-box;
}

.icon:hover {
    border: none;
}


@media screen and (max-width: 768px) {
    .cf-container {
        height: 100%;
        width: 100%;
        box-shadow: none;
    }
    .chat_frame {
        border-radius: 0;
    }
    span {
        padding: 3px;
    }
}
</style>