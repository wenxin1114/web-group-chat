<script setup>
import { getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance()
const props = defineProps(['message', 'userList'])
const userId = props.message.sendUser
const user = props.userList.find(user => user.id === userId)
const isMyself = computed(() => {
    return userId === proxy.$store.state.user.id
})


</script>

<template>
    <div v-if="user" class="message_container" :style="{ justifyContent: isMyself ? 'right' : 'left' }">
        <div v-if="!isMyself" class="avatar">
            <img v-if="user.avatar" :src="user.avatar">
            <img v-else src="../assets/default_user.jpg">
        </div>
        <div class="content">
            <div :style="{ textAlign: isMyself ? 'right' : 'left' }">
                <span>{{ user.nickname }}</span>
            </div>
            <div class="msg" :style="{
                backgroundColor: isMyself ? 'rgb(0,153,255)' : 'rgb(255,255,255)',
                color: isMyself ? 'rgb(255,255,255)' : 'rgb(0,0,0)'
            }">
                {{ message.content }}
            </div>
        </div>
        <div v-if="isMyself" class="avatar">
            <img v-if="user.avatar" :src="user.avatar">
            <img v-else src="../assets/default_user.jpg">
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