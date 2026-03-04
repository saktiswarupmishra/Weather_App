<template>
  <div class="space-y-4">
    <div v-for="n in count" :key="n"
      class="rounded-2xl p-6 sm:p-8 overflow-hidden animate-pulse"
      :class="isDark ? 'bg-white/[.03]' : 'bg-white/60'"
      :style="{ animationDelay: `${n * 100}ms` }">
      <!-- Header skeleton -->
      <div class="flex items-center gap-4 mb-5">
        <div class="w-20 h-20 rounded-2xl" :class="isDark ? 'bg-white/[.04]' : 'bg-slate-100'"></div>
        <div class="flex-1 space-y-3">
          <div class="h-5 rounded-lg animate-shimmer" :class="isDark ? 'bg-white/[.04]' : 'bg-slate-100'" style="width: 40%"></div>
          <div class="h-8 rounded-lg animate-shimmer" :class="isDark ? 'bg-white/[.04]' : 'bg-slate-100'" style="width: 30%; animation-delay: 0.2s"></div>
          <div class="h-3 rounded-lg animate-shimmer" :class="isDark ? 'bg-white/[.04]' : 'bg-slate-100'" style="width: 60%; animation-delay: 0.4s"></div>
        </div>
      </div>
      <!-- Stats skeleton -->
      <div class="grid grid-cols-4 gap-3">
        <div v-for="s in 4" :key="s"
          class="h-16 rounded-2xl animate-shimmer"
          :class="isDark ? 'bg-white/[.03]' : 'bg-slate-100'"
          :style="{ animationDelay: `${s * 0.15}s` }">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

defineProps({
  count: { type: Number, default: 1 },
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
</script>
