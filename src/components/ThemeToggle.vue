<template>
  <button @click="themeStore.toggleTheme()"
    class="relative w-[60px] h-[34px] rounded-full p-[3px] transition-all duration-500 group"
    :class="themeStore.isDark
      ? 'bg-gradient-to-r from-navy-light to-navy shadow-inner'
      : 'bg-gradient-to-r from-slate-200/80 to-slate-300/60 shadow-inner'"
    :title="themeStore.isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
    <!-- Track BG -->
    <div class="absolute inset-[3px] rounded-full transition-all duration-500"
      :class="themeStore.isDark ? 'bg-navy-light' : 'bg-gradient-to-r from-sky/15 to-cyan/15'"></div>
    <!-- Sliding Indicator -->
    <div class="relative w-7 h-7 rounded-full flex items-center justify-center transition-all duration-500 shadow-md"
      :class="themeStore.isDark ? 'translate-x-0 bg-navy-dark' : 'translate-x-[26px] bg-white'"
      :style="{ boxShadow: themeStore.isDark ? '0 0 12px rgba(245,158,11,0.25)' : '0 2px 8px rgba(0,0,0,0.12)' }">
      <transition name="view" mode="out-in">
        <svg v-if="themeStore.isDark" key="moon" width="14" height="14" viewBox="0 0 24 24" fill="none"
          class="text-gold transition-transform duration-500" style="transform: rotate(-20deg)">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor"/>
        </svg>
        <svg v-else key="sun" width="14" height="14" viewBox="0 0 24 24" fill="none"
          class="text-gold transition-transform duration-500" style="transform: rotate(0deg)">
          <circle cx="12" cy="12" r="4" fill="currentColor"/>
          <path d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42"
            stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </transition>
    </div>
  </button>
</template>

<script setup>
import { useThemeStore } from '../store/theme'
const themeStore = useThemeStore()
</script>
