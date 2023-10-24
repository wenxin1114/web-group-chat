<script setup>
const props = defineProps({
    type: { type: String, default: 'info' },
    content: { type: String, default: '' },
    duration: { type: Number, default: 3000 }
})
</script>

<template>
    <div :class="['container', props.type]">
        <img v-if="props.type === 'success'" src="./svg/success.svg">
        <img v-else-if="props.type === 'warning'" src="./svg/warning.svg">
        <img v-else-if="props.type === 'error'" src="./svg/error.svg">
        <img v-else-if="props.type === 'info'" src="./svg/info.svg">
        <p>{{ props.content }}</p>
    </div>
</template>

<style scoped>
.container {
    position: fixed;
    top: 5%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    align-items: center;
    /* 垂直居中 */
    z-index: 9999;
    width: auto;
    padding: 5px;
    height: 5%;
    border-radius: 8px;
    text-align: center;
}

p {
    margin: 0 8px;
    font-size: 14px;
    font-weight: 500;
}

.success {
    color: #40b605;
    background-color: #e2f9d6;
}

.error {
    color: #f56c6c;
    background-color: #fef0f0;
}

.warning {
    color: #e6a23c;
    background-color: #fdf6ec;
}

.info {
    color: #909399;
    background-color: #f4f4f5;
}
</style>

