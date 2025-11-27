<template>
  <div
    v-if="globalLoading"
    class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
  >
    <div class="loader"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const globalLoading = computed(() => store.state.movies.globalLoading);
</script>

<style scoped>
.loader {
  width: 60px;
  height: 60px;
  border: 6px solid #bbbbff;
  border-top-color: #6a0dad;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
