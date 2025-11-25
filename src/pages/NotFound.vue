<template>
  <div class="flex flex-col items-center justify-center h-[70vh] text-center">
    <h1 class="text-5xl font-bold text-purple-600 mb-4">404</h1>
    <p class="text-gray-600 mb-6">The movie you're looking for doesn't exist.</p>

    <router-link
      to="/"
      class="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
    >
      Go Back Home
    </router-link>
  </div>
</template>
