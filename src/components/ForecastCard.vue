<template>
  <div class="rounded-2xl p-4 text-center transition-all duration-300 cursor-pointer group relative overflow-hidden"
    :class="isDark
      ? 'bg-white/[.04] hover:bg-white/[.07] border border-white/[.05] hover:border-teal/20'
      : 'bg-white/80 hover:bg-white border border-slate-200/50 hover:border-teal/25 shadow-sm hover:shadow-md hover:shadow-black/[.04]'">
    <!-- Day Name -->
    <div class="text-[11px] font-semibold uppercase tracking-widest mb-2.5"
      :class="isDark ? 'text-slate-500' : 'text-slate-400'">
      {{ dayName }}
    </div>

    <!-- Icon -->
    <div class="relative my-2">
      <img :src="iconUrl" :alt="desc" class="w-14 h-14 mx-auto transition-transform duration-300 group-hover:scale-110 drop-shadow-md" />
    </div>

    <!-- Temperature -->
    <div class="flex items-center justify-center gap-2 mt-2.5">
      <span class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-navy'">{{ Math.round(high) }}°</span>
      <span class="text-sm font-medium" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ Math.round(low) }}°</span>
    </div>

    <!-- Temp Range Bar -->
    <div class="mt-3 mx-2 h-1.5 rounded-full overflow-hidden" :class="isDark ? 'bg-white/[.08]' : 'bg-slate-100'">
      <div class="h-full rounded-full bg-gradient-to-r from-sky via-teal to-gold transition-all duration-500"
        :style="{ width: tempBarWidth + '%' }"></div>
    </div>

    <!-- Description -->
    <div class="text-[11px] mt-2.5 capitalize truncate px-1 font-medium"
      :class="isDark ? 'text-slate-500' : 'text-slate-400'">
      {{ desc }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'
import { getWeatherIcon } from '../services/weatherApi'

const props = defineProps({
  day: { type: Object, required: true },
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const dayName = computed(() => {
  const d = new Date(props.day.dt * 1000)
  const today = new Date()
  if (d.toDateString() === today.toDateString()) return 'Today'
  return d.toLocaleDateString('en-US', { weekday: 'short' })
})

const high = computed(() => props.day.main?.temp_max || props.day.temp?.max || 0)
const low = computed(() => props.day.main?.temp_min || props.day.temp?.min || 0)
const desc = computed(() => props.day.weather?.[0]?.description || '')
const iconUrl = computed(() => getWeatherIcon(props.day.weather?.[0]?.icon || '01d'))

const tempBarWidth = computed(() => {
  const temp = props.day.main?.temp || 20
  return Math.min(Math.max(((temp + 10) / 50) * 100, 10), 100)
})
</script>
