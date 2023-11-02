<script setup>
import { useStore } from 'vuex';
import {computed} from 'vue'
import {openUserCard} from '../../utils/index'
const store = useStore()
const user = computed(() => {
    return store.state.user
})
const imgError = (event) => {
    event.target.src = new URL('../../assets/default_user.jpg', import.meta.url).href
}

const onlineNum = computed(() => {
    return store.state.onlineNum
})

</script>
<template>
    <div class="left-sidebar">
        <div class="avatar" >
            <img @click="openUserCard(user)" :src="'/api/pic/' + user.avatar" @error="imgError">
        </div>
        <div class="online">{{ onlineNum }}</div>
        <div>

        </div>
    </div>
</template>

<style scoped>
.left-sidebar {
    width: 60px;
    height: 100%;
    border-radius: 15px;
    margin-right: 8px;
    background-color: #70e3e3;
    display: flex;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);

}
.avatar {
    width: 60px;
    height: 100%;
    display: flex;
    justify-content: center;
    padding: 2px;
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

@media screen and (max-width: 768px) {
    .left-sidebar {
        width: 100%;
        justify-content: flex-start;
        border-radius: 0;
        align-items: center;
        box-shadow: none;
    }
    .avatar {
        /* border-bottom: none;
        border-right: 1px solid #86898b; */
        align-items: center;
        text-align: center;
    }
}
</style>