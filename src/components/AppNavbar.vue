<template>
  <nav class="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
       :class="scrolled ? 'py-2' : 'py-3.5'"
       :style="navStyle">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-3 group">
        <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal via-cyan to-sky flex items-center justify-center shadow-lg group-hover:shadow-teal/25 transition-all duration-300 group-hover:scale-105">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" class="text-white">
            <circle cx="12" cy="12" r="7" stroke="currentColor" stroke-width="1.5" fill="none" opacity="0.7"/>
            <ellipse cx="12" cy="12" rx="8" ry="3.5" stroke="currentColor" stroke-width="1" fill="none" transform="rotate(-25 12 12)" opacity="0.5"/>
            <circle cx="12" cy="5.5" r="1.8" fill="currentColor" opacity="0.8"/>
            <circle cx="16.5" cy="10" r="1.2" fill="currentColor" opacity="0.5"/>
            <circle cx="8" cy="15" r="1" fill="currentColor" opacity="0.4"/>
          </svg>
          <div class="absolute inset-0 rounded-xl bg-gradient-to-br from-teal to-cyan opacity-0 group-hover:opacity-25 blur-xl transition-opacity duration-500"></div>
        </div>
        <div>
          <span class="font-display font-bold text-lg tracking-tight" :class="isDark ? 'text-white' : 'text-navy'">Clima<span class="text-gradient">Sphere</span></span>
          <span class="block text-[10px] tracking-[0.2em] uppercase -mt-0.5" :class="isDark ? 'text-teal-light/60' : 'text-teal-dark/60'">Weather Intelligence</span>
        </div>
      </router-link>

      <!-- Nav Links (Desktop) -->
      <div class="hidden md:flex items-center gap-1 rounded-2xl p-1.5" :class="isDark ? 'bg-white/[.04]' : 'bg-slate-100/80'">
        <router-link
          v-for="link in links" :key="link.to"
          :to="link.to"
          class="relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
          :class="[
            $route.path === link.to
              ? (isDark ? 'text-white bg-white/[.1] shadow-sm' : 'text-navy bg-white shadow-sm shadow-black/[.04]')
              : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/[.05]' : 'text-slate-500 hover:text-navy hover:bg-white/60')
          ]"
        >
          <span class="flex items-center gap-2">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="link.iconPath"></svg>
            {{ link.label }}
          </span>
        </router-link>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-2.5">
        <ThemeToggle />
        <!-- Mobile Menu Button -->
        <button @click="mobileOpen = !mobileOpen"
          class="md:hidden p-2.5 rounded-xl transition-all duration-300"
          :class="isDark ? 'text-slate-300 hover:bg-white/10' : 'text-slate-500 hover:bg-slate-100'">
          <svg width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path v-if="!mobileOpen" d="M3 6h18M3 12h18M3 18h18"/>
            <path v-else d="M6 6l12 12M6 18L18 6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <transition name="view">
      <div v-if="mobileOpen" class="md:hidden mt-3 mx-4 rounded-2xl p-2.5 flex flex-col gap-0.5"
        :class="isDark ? 'glass' : 'bg-white/90 backdrop-blur-xl border border-slate-200/60 shadow-xl shadow-black/[.04]'">
        <router-link
          v-for="(link, i) in links" :key="link.to"
          :to="link.to"
          class="px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300"
          :class="[
            $route.path === link.to
              ? (isDark ? 'text-teal bg-teal/10' : 'text-teal-dark bg-teal/8')
              : (isDark ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-slate-600 hover:text-navy hover:bg-slate-50')
          ]"
          :style="{ animationDelay: `${i * 50}ms` }"
          @click="mobileOpen = false"
        >
          <span class="flex items-center gap-3">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" v-html="link.iconPath"></svg>
            {{ link.label }}
          </span>
        </router-link>
      </div>
    </transition>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useThemeStore } from '../store/theme'
import ThemeToggle from './ThemeToggle.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const mobileOpen = ref(false)
const scrolled = ref(false)

const navStyle = computed(() => ({
  background: scrolled.value
    ? (isDark.value ? 'rgba(5,13,22,0.88)' : 'rgba(248,250,252,0.85)')
    : 'transparent',
  backdropFilter: scrolled.value ? 'blur(20px) saturate(180%)' : 'none',
  borderBottom: scrolled.value
    ? (isDark.value ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)')
    : '1px solid transparent',
  boxShadow: scrolled.value
    ? (isDark.value ? '0 4px 30px rgba(0,0,0,0.3)' : '0 4px 30px rgba(0,0,0,0.04)')
    : 'none',
}))

const links = [
  { to: '/', label: 'Dashboard', iconPath: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
  { to: '/map', label: 'Map', iconPath: '<polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>' },
  { to: '/forecast', label: 'Forecast', iconPath: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>' },
  { to: '/favorites', label: 'Favorites', iconPath: '<path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>' },
  { to: '/alerts', label: 'Alerts', iconPath: '<path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>' },
]

function onScroll() {
  scrolled.value = window.scrollY > 10
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }))
onUnmounted(() => window.removeEventListener('scroll', onScroll))
</script>
