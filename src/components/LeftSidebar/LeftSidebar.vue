<script setup>
import { useStore } from 'vuex';
import { ref, computed } from 'vue'
import UserCard from '../UserCard/UserCard.vue';
const store = useStore()
const user = computed(() => {
    return store.state.user
})
const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}

const cardState = ref(false)

const onlineNum = computed(() => {
    return store.state.onlineNum
})

</script>
<template>
    <div class="left-sidebar">
        <div class="avatar">
            <img @click="cardState = true" :src="'/api/pic/' + user.avatar" @error="imgError">
        </div>
        <div class="online">
            问心聊天室 ({{ onlineNum }})
        </div>
    </div>
    <UserCard v-if="cardState" @close-card="cardState = false"></UserCard>
</template>

<style scoped>
.left-sidebar {
    width: 60px;
    height: 100%;
    border-radius: 15px;
    margin-right: 8px;
    background-color: rgb(159, 242, 242);
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);
}

.item-box {
    width: 50px;
    height: 50px;
    border-radius: 15px;
}

.avatar {
    width: 60px;
    height: 60px;
    padding: 2px;
    display: flex;
    justify-content: center;
}

.avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 2px solid #ffffff;
}

.avatar img:hover {
    cursor: pointer;
    border: 2px solid #3046c1;
}
.online {
    margin: 0 8px;
    text-align: center;
    color: #000000;
    font-size: 16px;
    display: none;
}

@media screen and (max-width: 768px) {
    .left-sidebar {
        width: 100%;
        height: 50px;
        justify-content: flex-start;
        border-radius: 0;
        align-items: center;
        box-shadow: none;
        flex-direction: row;

    }

    .avatar {
        align-items: center;
    }
    .online {
        display: inline-block;
    }
}
</style>