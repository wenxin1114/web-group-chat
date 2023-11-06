<script setup>
import { ref, computed } from 'vue'
import UserEditCard from '../UserEditCard/UserEditCard.vue';
import { useStore } from 'vuex';
const store = useStore()
const editState = ref(false)

const emit = defineEmits(['close-card'])
const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}

const user = computed(() => {
    return store.state.user
})

const gender = computed(() => {
    let user = store.state.user
    return user.gender === 0 ? '保密' : (user.gender === 1 ? '男' : '女')
})

</script>

<template>
    <div class="user-card">
        <span class="close-btn" @click="emit('close-card')">&times;</span>
        <div class="user-top">
            <div class="user-avatar">
                <img :src="'/api/pic/' + user.avatar" @error="imgError">
            </div>
            <div class="user-main">
                <div>{{ user.nickname }}</div>
                <div class="username"><span>UN</span>{{ user.username }}</div>
            </div>
        </div>
        <div class="user-info">
            <div><span>签名</span>{{ user.description }}</div>
            <div><span>性别</span>{{ gender }}</div>
        </div>
        <div class="user-floor">
            <img @click="editState = true" src="./svg/edit.svg">
        </div>
    </div>
    <UserEditCard v-if="editState" :user="user" @close-edit-card="editState = false"></UserEditCard>
</template>

<style scoped>
.user-card {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 200px;
    min-height: 300px;
    width: 250px;
    height: 300px;
    background-color: #ffffff;
    z-index: 10;
    border-radius: 15px;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
    padding: 20px;
}
.user-top {
    display: flex;
    align-items: center;
}
.user-info {
    margin-top: 10px;
    font-size: 14px;
}
.user-info div {
    margin: 10px 0;
}
.user-info span {
    user-select: none;
    color: #9e9393;
    margin-right: 10px;
}

.user-avatar {
    user-select: none;
    /* margin-right: 10px; */
}

.user-avatar img {
    border-radius: 50%;
    width: 80px;
    height: 80px;
    box-sizing: border-box;
}

.user-avatar img:hover {
    cursor: pointer;
    border: 2px solid #0077ff;
}
.user-main {
    padding: 20px;
}
.user-main .username {
    color: #9e9393;
    font-size: 14px;
}
.user-main .username span {
    margin-right: 5px;
    font-size: 12px;
}
.user-floor {
    position: absolute;
    padding: 5px;
    width: 30px;
    height: 30px;
    right: 20px;
    bottom: 20px;
    transition: all  .3s linear;
    border-radius: 50%;
    cursor: pointer;
}

.user-floor img {
    width: 30px;
}
.user-floor:hover {
    background-color: #68abf8;
}

.close-btn {
    text-align: center;
    width: 20px;
    height: 20px;
    line-height: 20px;
    font-size: 20px;
    position: absolute;
    top: 5px;
    right: 10px;
    z-index: 20;
    border-radius: 50%;
    transition: all .2s ease-in;
}

.close-btn:hover {
    cursor: pointer;
    background-color: #93d8ec;
}

@media screen and (max-width: 768px) {
    .user-card {
        width: 80%;
    }
}
</style>