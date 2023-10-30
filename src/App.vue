<script setup>
import { onMounted, onBeforeUnmount } from 'vue'
import { useStore } from 'vuex'
const store = useStore()

// 进入mounted生命钩子开始动态监测浏览器宽度
const handleResize = () => {
  store.commit('updateIsMdUp')
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <router-view></router-view>
</template>

<style scoped>

</style>
