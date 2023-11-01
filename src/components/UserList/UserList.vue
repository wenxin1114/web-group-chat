<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { getUserList } from '../../utils';
const store = useStore()
const userList = computed(() => {
    return store.state.userList
})
const onlineNum = computed(() => {
    return store.state.onlineNum
})
const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}
getUserList()
</script>

<template>
    <div class="user-list">
        <div class="top">
            在线人数：{{ onlineNum }}
        </div>
        <div class="list">
            <div v-for="user in userList">
                <div :class="['user', { 'gary': user.online === 0 ? true : false }]">
                    <img :src="'/api/pic/' + user.avatar" @error="imgError">
                    <span class="nickname">{{ user.nickname }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-list {
    min-width: 200px;
    height: 100%;
    border-radius: 15px;
    background-color: #efeded;
    margin-left: 10px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);

}

.top {
    padding: 15px 15px 0 15px;
}

.list {
    padding: 15px;
}

.user {
    display: flex;
    height: 30px;
    align-items: center;
    border-radius: 8px;
}

.user img {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    margin-left: 5px;
    margin-right: 5px;
}

.gary {
    filter: grayscale(100%);
}

.user:hover {
    background-color: #d5caca;
}

.nickname {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>