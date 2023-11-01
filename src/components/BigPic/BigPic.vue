<script setup>
import { computed } from 'vue';
import store from '../../store';
const props = defineProps(['picUrl', 'closeBigPic'])
// const bigPicShow = computed(() => {
//   return store.state.bigPicShow
// })
</script>

<template>
    <div class="modal">
        <span class="close" @click="props.closeBigPic()">&times;</span>
        <img :src="props.picUrl" class="modal-content" />
    </div>
</template>


<style scoped>

/* Styles for the modal */
.modal {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
}

/* Styles for the modal content (the image) */
.modal-content {
  max-width: 90%;
  max-height: 90%;
}

/* Styles for the close button */
.close {
  position: absolute;
  top: 10px;
  right: 25px;
  font-size: 30px;
  cursor: pointer;
  color: white;
}
</style>