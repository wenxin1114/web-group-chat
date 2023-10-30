<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex';
const store = useStore()
const props = defineProps(['message'])
import {openUserCard} from '../../utils/index'
const userId = props.message.sendUser
const sendUser = store.state.userList.find(user => user.id === userId)
const isMyself = computed(() => {
    return userId === store.state.user.id
})
</script>

<template>
    <div v-if="sendUser" class="message_container" :style="{ justifyContent: isMyself ? 'right' : 'left' }">
        <div v-if="!isMyself" class="avatar">
            <img @click="openUserCard(sendUser)" :src="sendUser.avatar ? '/api/pic/' + sendUser.avatar : '/src/assets/default_user.jpg'" onerror="this.src = '/src/assets/default_user.jpg'">
        </div>
        <div class="content">
            <div :style="{ textAlign: isMyself ? 'right' : 'left' }">
                <span>{{ sendUser.nickname }}</span>
            </div>
            <div class="msg" :style="{
                backgroundColor: isMyself ? 'rgb(0,153,255)' : 'rgb(255,255,255)',
                color: isMyself ? 'rgb(255,255,255)' : 'rgb(0,0,0)'
            }">
                {{ message.content }}
            </div>
        </div>
        <div v-if="isMyself" class="avatar">
            <img @click="openUserCard(sendUser)" :src="sendUser.avatar ? '/api/pic/' + sendUser.avatar : '/src/assets/default_user.jpg'" onerror="this.src = '/src/assets/default_user.jpg'">
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

.content {
    margin: 0 10px;
}

.content .msg {
    background-color: rgb(0, 153, 255);
    color: rgb(255, 255, 255);
    padding: 12px;
    border-radius: 10px;
    margin-top: 5px;
    font-size: 16px;
    /* 自动换行 */
    white-space: normal;
    word-break: break-all;
    overflow: hidden;
}
</style>