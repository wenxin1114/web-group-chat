<script setup>
import ChatFrame from '../components/ChatFrame.vue';
import Login from '../components/Login.vue';
import { wsInit, getUserInfo, getUserInfoList, getMsgRecord } from '../utils';
import { onMounted, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
import Message from '../components/Message/index'

onMounted(() => {
    if (proxy.$store.state.loginState) {
        // 如果登录了直接连接 websocket
        Message('已登录', 'success')
        getUserInfoList()
        getUserInfo()
        getMsgRecord()
        wsInit()
    } else {
        // 未登录
        Message('未登录', 'warning')
    }
})
</script>

<template>
    <div>
        <ChatFrame></ChatFrame>
        <Login v-if="!$store.state.loginState"></Login>
    </div>
</template>

<style scoped>
div {
    width: 100%;
    height: 100vb;
}
</style>