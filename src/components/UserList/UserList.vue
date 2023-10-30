<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
const store = useStore()
const userList = computed(() => {
    return store.state.userList
})
const onlineUser = computed(() => {
    return store.state.onlineUser
})
</script>

<template>
    <div class="user-list">
        <div class="top">
            在线人数：{{ onlineUser.length }}
        </div>
        <div class="list">
            <div v-for="user in userList">
                <div :class="['user', { 'gary': !onlineUser.includes(user.id) }]">
                    <img :src="user.avatar ? '/api/pic/' + user.avatar : '/src/assets/default_user.jpg'" onerror="this.src = '/src/assets/default_user.jpg'">
                    <span>{{ user.nickname }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.user-list {
    min-width: 200px;
    width: 15%;
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
</style>