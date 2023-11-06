<script setup>
import { useStore } from 'vuex';
import { ref, reactive, nextTick, watch, getCurrentInstance, computed, onMounted } from 'vue'
import ChatMessage from '../ChatMessage/ChatMessage.vue';
import { getMsgRecord, uploadFile } from '../../utils';
import Message from '../Message/index';
import EmojiBox from '../EmojiBox/EmojiBox.vue';
import Recorder from 'js-audio-recorder';
const store = useStore()
const { proxy } = getCurrentInstance()

const sendFrom = reactive({
    sendUser: null,
    content: '',
    contentType: 0,
    audioDuration: null,
    audioSize: null
})

const emojiState = ref(false)
const scrollContainer = ref(null);
const emojiBox = ref(null)
const emojiIcon = ref(null)
const uploadPic = ref(null)
const chatType = ref(true)
const recordState = ref(false)
const recorder = ref(new Recorder({
    sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
    sampleRate: 16000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
    numChannels: 1 // 声道，支持 1 或 2， 默认是1
}))
const msgList = computed(() => {
    return store.state.msgList
})
// 监听消息数组长度
// watch(() => msgList.length, () => {

// })
// 发送消息
const sendMessage = () => {
    if (sendFrom.content !== "") {
        sendFrom.sendUser = store.state.user.id
        proxy.$axios.post("/chat/msg/send", sendFrom).then(resp => {
            const { code, message } = resp.data
            if (code === 200) {
                // 发送成功

                console.log(message)
            }
        }).catch(error => {
            Message('消息发送接口异常', 'warning')
        })
        sendFrom.content = ''
        sendFrom.contentType = 0
        sendFrom.audioDuration = null
        sendFrom.audioSize = null
    }
}
// 上传图片
const sendPicMessage = () => {
    let formData = new FormData()
    formData.append('file', uploadPic.value.files[0])
    uploadFile().then(resp => {
        if (resp) {
            sendFrom.contentType = 1
            sendFrom.content = resp
            sendMessage()
        }
    })
}
// 上传语音
const snedAudioMessage = () => {
    let formData = new FormData()
    formData.append('file', recorder.value.getWAVBlob(), 'audio.wav')
    uploadFile(formData).then(resp => {
        if (resp) {
            sendFrom.contentType = 2
            sendFrom.content = resp
            sendFrom.audioDuration = recorder.value.duration
            sendFrom.audioSize = recorder.value.fileSize
            sendMessage()
        }
    })
}
// 上滑获取历史记录
const handleScroll = () => {
    const scrollY = scrollContainer.value.scrollTop;
    if (scrollY <= 10) {
        getMsgRecord()
    }
}
// 添加表情
const addEmoji = (emoji) => {
    sendFrom.content += emoji
    emojiState.value = false
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
// 录音
const recording = () => {
    if (recordState.value) {
        // 正在录音
        console.log('结束录音')
        recorder.value.stop()
        recordState.value = false
        if (recorder.value.duration < 2) {
            Message('录制时间太短，建议2秒以上', 'warning')
        } else if (recorder.value.duration > 180) {
            Message('录制时间太长，建议3分钟之内', 'warning')
        } else {
            snedAudioMessage()
        }
    } else {
        Recorder.getPermission().then(() => {
            recorder.value.start().then(() => {
                recordState.value = true
                // 开始录音
                console.log('开始录音')
            }, (error) => {
                // 出错了
                Message('录音异常', 'warning')
            });
        }, (error) => {
            Message('没有允许录音权限，请授权', 'warning')
        });
    }
}


onMounted(() => {
    store.commit('saveScrollContainer', scrollContainer.value)
    getMsgRecord()

})
</script>

<template>
    <div class="cf-container" @click="clickFrame">
        <div class="chat_frame" ref="scrollContainer" @scroll="handleScroll">
            <div v-if="msgList" class="chat">
                <div v-for="msg in msgList" :key="msg.id">
                    <ChatMessage :message="msg"></ChatMessage>
                </div>
            </div>
        </div>
        <div class="send_box" @keydown.enter="sendMessage" @keydown.enter.prevent>
            <textarea v-if="chatType" ref="myTextarea" v-model="sendFrom.content"></textarea>
            <div v-else @click="recording" class="record-btn">
                <span v-if="recordState">录音中: {{ parseInt(recorder.duration) }}s</span>
                <span v-else>点击开始录音</span>
            </div>
            <EmojiBox v-show="emojiState" @add-emoji="addEmoji" ref="emojiBox"></EmojiBox>
            <div class="toolbar">
                <span @click="chatType = !chatType">
                    <icon-enter-the-keyboard v-if="chatType" theme="two-tone" size="20" :fill="['#4a90e2', '#a8e6f0']"
                        :strokeWidth="3" />
                    <icon-voice v-else theme="two-tone" size="20" :fill="['#4a90e2', '#a8e6f0']" :strokeWidth="3" />
                </span>
                <span @click="emojiState = !emojiState" ref="emojiIcon">
                    <icon-smiling-face class="icon" size="20" theme="two-tone" :fill="['#429e9e', '#a8e6f0']"
                        :strokeWidth="3" />
                </span>
                <span @click="uploadPic.click()">
                    <input type="file" ref="uploadPic" accept="image/png, image/jpeg" @change="sendPicMessage">
                    <icon-pic class="icon" theme="two-tone" size="20" :fill="['#429e9e', '#a8e6f0']" :strokeWidth="3" />
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

input[type="file"] {
    display: none;
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
}

.send_box textarea:focus {
    border: 1px solid #1078e8;
}

.send_box .record-btn {
    text-align: center;
    flex-grow: 1;
    border-radius: 10px;
    background-color: #fff;
    border: none;
    outline: none;
    height: auto;
    padding: 10px;
    margin: 0 5px;
    user-select: none;
}

.send_box .record-btn:hover {
    cursor: pointer;
    border: 1px solid #1078e8;
}

.send_box .record-btn:active {
    border: 1px solid #1078e8;
    background: linear-gradient(145deg, #ece6e6, #f0f0f0);
}

.toolbar {
    display: flex;
    flex-shrink: 0;
    flex-basis: auto;
}

.toolbar span {
    padding: 8px;
    border-radius: 10px;
    transition: background-color .4s ease-in;
}

.toolbar span:hover {
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

    .send_box {
        border-radius: 0;
    }

    .toolbar span {
        padding: 3px;
    }
}
</style>