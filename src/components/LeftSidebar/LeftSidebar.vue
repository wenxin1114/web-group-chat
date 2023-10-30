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

</script>
<template>
    <div class="left-sidebar">
        <div class="avatar" >
            <img @click="openUserCard(user)" :src="'/api/pic/' + user.avatar" @error="imgError">
        </div>
    </div>
</template>

<style scoped>
.left-sidebar {
    width: 60px;
    height: 100%;
    border-radius: 15px;
    margin-right: 8px;
    background-color: #e9f3f3;
    display: flex;
    justify-content: center;
    box-shadow: 0 0 15px rgba(0, 0, 0, .5);

}
.avatar {
    padding: 2px;
}
.avatar img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    box-sizing: border-box;
}

.avatar img:hover {
    cursor: pointer;
    border: 2px solid #2698ea;
}

@media screen and (max-width: 768px) {
    .left-sidebar {
        display: none;
    }
}
</style>