<script setup>
import ChatFrame from '../components/ChatFrame/ChatFrame.vue';
import Login from '../components/Login/Login.vue';
import { wsInit, getUserInfo, getUserList, getMsgRecord } from '../utils';
import Message from '../components/Message/index'
import UserList from '../components/UserList/UserList.vue';
import { useStore } from 'vuex';
import LeftSidebar from '../components/LeftSidebar/LeftSidebar.vue'
import UserCard from '../components/UserCard/UserCard.vue'
import { computed } from 'vue';
const store = useStore()
const userCardState = computed(() => {
    return store.state.userCardState
})
const loginState = computed(() => {
    return store.state.loginState
})

if (loginState) {
    // 如果登录了直接连接 websocket
    Message('已登录', 'success')
    getUserInfo()
    wsInit()
} else {
    // 未登录
    Message('未登录', 'warning')
}

</script>

<template>
    <div class="home">
        <div class="left">
            <LeftSidebar></LeftSidebar>
        </div>
        <div class="center">
            <ChatFrame></ChatFrame>
        </div>
        <div class="right">
            <UserList></UserList>
        </div>
    </div>
    <UserCard v-if="userCardState"></UserCard>
    <Login v-if="!store.state.loginState"></Login>
</template>

<style scoped>
.home {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}
.left {
    height: 80%;
}
.center {
    width: 60%;
    height: 80%;
}
.right {
    width: 15%;
    height: 80%;
}
@media screen and (max-width: 768px)  {
    .home {
        flex-direction: column;
        align-items:flex-start;
    }
    .left {
        display: none;
    }
    .center {
        width: 100%;
        height: 100%;
    }
    .right {
        display: none;
    }
}
</style>