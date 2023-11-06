<script setup>
const emit = defineEmits(['add-emoji'])
const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙃', '🫠', '😉', '😊', '😇', '🥰', '😍', '🤩', '😚', '😙', '🥲', '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🫢', '🫣', '🤔', '🫡', '🤐', '🤨', '😑', '😷', '🤮', '🤡', '😬', '😶', '🤥', '😒', '🙄', '😪', '😴', '😵', '💫', '😵', '😎', '🤓', '🧐', '😕', '🫤', '🥹', '🥺', '😲', '😮', '😳', '😨', '😰', '😢', '😭', '😱', '😖', '😞', '😣', '😓', '😩', '🥱', '😤', '😡', '😠', '🤬', '😈', '👿', '💀', '💩', '👹', '👺', '👻', '👽', '🤖', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🙈', '🙉', '🙊', '💦', '💋', '💢', '💥']

const clickEmoji = (e) => {
    emit('add-emoji', e.target.innerText)
}
</script>
<template>
    <Transition name="fade">
        <div class="emoji-box">
            <span v-for="emoji in emojis" @click="clickEmoji($event)">{{ emoji }}</span>
        </div>
    </Transition>
</template>

<style scoped>
.emoji-box {
    padding: 2px;
    width: 320px;
    height: 250px;
    position: absolute;
    right: 20px;
    bottom: 50px;
    background-color: #dad3d3;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .5);
    overflow-y: auto;
}

.emoji-box::-webkit-scrollbar {
    width: 3px;
}

.emoji-box::-webkit-scrollbar-track {
    /* 滚动条背景颜色 */
    background-color: transparent;
    border-radius: 15px;
    /* 设置滚动条的圆角 */

}

.emoji-box::-webkit-scrollbar-thumb {
    /* 滚动条滑块颜色 */
    background-color: #3c6fdd;
    border-radius: 15px;
    /* 设置滚动条的圆角 */
    cursor: pointer;

}

.emoji-box::-webkit-scrollbar-thumb:hover {
    /* 鼠标悬停时滚动条滑块颜色 */
    background-color: #dfd61c;

}

.emoji-box span {
    font-size: 23px;
    display: inline-block;
    cursor: pointer;
}

.emoji-box span:hover {
    background-color: #fff;
    border-radius: 8px;
}

.fade-leave,
.fade-enter-to {
    opacity: 1;
}

.fade-leave-active,
.fade-enter-active {
    transition: all .5s;
}

.fade-leave-to,
.fade-enter {
    opacity: 0;
}</style>