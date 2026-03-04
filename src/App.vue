<template>
  <div :data-theme="themeStore.isDark ? 'dark' : 'light'" class="min-h-screen">
    <AppNavbar />
    <router-view v-slot="{ Component }">
      <transition name="view" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useThemeStore } from './store/theme'
import AppNavbar from './components/AppNavbar.vue'

const themeStore = useThemeStore()
</script>
