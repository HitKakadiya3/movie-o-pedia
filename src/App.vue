<template>
  <div class="min-h-screen bg-gray-100">
    <GlobalLoader />
    <Header></Header>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/Header.vue";
import GlobalLoader from "./components/GlobalLoader.vue";
</script>
