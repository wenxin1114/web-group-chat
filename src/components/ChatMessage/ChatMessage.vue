<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex';
import BigPic from '../BigPic/index'
import { Howl } from 'howler'
const store = useStore()
const props = defineProps(['message'])
const userId = props.message.sendUser
const twinkleState = ref(false)
const isMyself = computed(() => {
    return userId === store.state.user.id
})
const sendUser = computed(() => {
    return store.state.userList.find(user => user.id === userId)
})
const avatarError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}
const picError = (event) => {
    event.target.src = new URL('../../assets/picError.svg', import.meta.url).href
}

const clickAudio = () => {
    twinkleState.value = true
    let sound = new Howl({
        src: [`/api/audio/${props.message.content}`]
    });
    sound.on('end', () => {
        twinkleState.value = false
      });
    sound.play();
}

const showTime = computed(() => {
    // 获取目标日期时间
    let targetDate = new Date(props.message.sendTime);
    // 获取当前日期时间
    let now = new Date();
    // 判断是否是同一天
    if (targetDate.toDateString() === now.toDateString()) {
        return props.message.sendTime.split(' ')[1]
    } else {
        return props.message.sendTime
    }
})
</script>

<template>
    <div v-if="sendUser" class="message_container" :style="{ justifyContent: isMyself ? 'right' : 'left' }">
        <div v-if="!isMyself" class="avatar">
            <img :src="'/api/pic/' + sendUser.avatar" @error="avatarError">
        </div>
        <div class="content">
            <div :style="{ textAlign: isMyself ? 'right' : 'left' }">
                <span class="send-time" v-if="isMyself">{{ showTime }}</span>
                <span class="nickname">{{ sendUser.nickname }}</span>
                <span class="send-time" v-if="!isMyself">{{ showTime }}</span>
            </div>
            <div class="msg" :style="{
                backgroundColor: isMyself ? 'rgb(0,153,255)' : 'rgb(255,255,255)',
                color: isMyself ? 'rgb(255,255,255)' : 'rgb(0,0,0)',
                float: isMyself ? 'right' : 'left'
            }">
                <p v-if="message.contentType === 0">{{ message.content }}</p>
                <img v-else-if="message.contentType === 1" @click="BigPic($event.target.src)"
                    :src="'/api/pic/' + message.content" @error="picError">
                <div class="audio" v-else-if="message.contentType === 2" @click="clickAudio">
                    <span :class="{'icon-twinkle': twinkleState}">
                        <icon-acoustic theme="outline" size="20" :fill="isMyself ? '#ffffff' : '#000000'" :strokeWidth="3" />
                    </span>
                    <span class="text">{{ parseInt(message.audioDuration) }}"</span>
                </div>
            </div>
        </div>
        <div v-if="isMyself" class="avatar">
            <img :src="'/api/pic/' + sendUser.avatar" @error="avatarError">
        </div>
    </div>
</template>

<style scoped>
.message_container {
    min-height: 70px;
    position: relative;
    display: flex;
    width: 100%;
    margin-bottom: 20px;
}

.avatar img {
    width: 40px;
    border-radius: 50%;
    box-sizing: border-box;
}

.avatar img:hover {
    cursor: pointer;
    border: 2px solid #2698ea;
}

.send-time {
    color: #948d8d;
    margin: 0 10px;
}

.content {
    margin: 0 10px;
}

.nickname {
    width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.content .msg {
    display: inline-block;
    /* 将元素设置为内联块级元素 */
    background-color: rgb(0, 153, 255);
    color: rgb(255, 255, 255);
    padding: 8px;
    border-radius: 10px;
    margin-top: 5px;
    font-size: 16px;
    /* 自动换行 */
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
}

.msg img {
    width: 200px;
}

.msg img:hover {
    cursor: zoom-in;
}

.msg .audio {
    display: flex;
    justify-content: center;
}

.msg .audio:hover {
    cursor: pointer;
}

.msg .audio .icon-twinkle {
    animation: twinkle 1s infinite;
}

.msg .audio .text {
    margin-left: 5px;
}

@keyframes twinkle {
    0% {
        transform: scale(1);
        opacity: 1;
    }

    50% {
        transform: scale(1.1);
        opacity: 0.5;
    }

    100% {
        transform: scale(1);
        opacity: 1;
    }
}

@media screen and (max-width: 768px) {
    .nickname {
        width: 200;
    }
}
</style>