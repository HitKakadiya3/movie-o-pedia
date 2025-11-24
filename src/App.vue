<template>
  <div class="min-h-screen bg-gray-100">
    <Header></Header>
    <RouterView />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import Header from "./components/Header.vue";
</script>
