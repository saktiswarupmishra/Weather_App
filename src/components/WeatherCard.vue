<template>
  <div class="glass-card card-hover overflow-hidden"
    :class="isDark ? '' : 'glass-card-light'">
    <!-- Accent Gradient Strip -->
    <div class="accent-line w-full"></div>

    <div class="p-6 sm:p-8">
      <!-- Header: City + Fav -->
      <div class="flex items-start justify-between mb-6">
        <div>
          <div class="flex items-center gap-2.5">
            <h3 class="text-2xl sm:text-3xl font-display font-bold tracking-tight" :class="isDark ? 'text-white' : 'text-navy'">
              {{ data.name }}
            </h3>
            <span class="text-[11px] font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider"
              :class="isDark ? 'bg-white/[.08] text-slate-400' : 'bg-slate-100 text-slate-500'">
              {{ data.sys?.country }}
            </span>
          </div>
          <p class="text-sm mt-1.5 capitalize" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            {{ description }}
          </p>
        </div>
        <button v-if="showFav" @click.stop="toggleFav"
          class="p-2.5 rounded-xl transition-all duration-300 group/fav"
          :class="isFav
            ? 'text-gold bg-gold/10 hover:bg-gold/20'
            : (isDark ? 'text-slate-500 hover:text-gold hover:bg-white/5' : 'text-slate-400 hover:text-gold hover:bg-slate-50')">
          <svg width="18" height="18" viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"
            class="transition-transform duration-300" :class="isFav ? 'scale-110' : 'group-hover/fav:scale-110'">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01z"/>
          </svg>
        </button>
      </div>

      <!-- Main Weather Display -->
      <div class="flex items-center gap-8 sm:gap-10 mb-8">
        <div class="relative">
          <img :src="iconUrl" :alt="description"
            class="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_8px_24px_rgba(0,0,0,0.2)] animate-float" />
          <div class="absolute inset-0 rounded-full blur-2xl opacity-30"
            :style="{ background: `radial-gradient(circle, ${accentColor}40 0%, transparent 70%)` }"></div>
        </div>
        <div>
          <div class="text-6xl sm:text-7xl font-display font-extrabold tracking-tight leading-none"
            :class="isDark ? 'text-white' : 'text-navy'">
            {{ Math.round(data.main?.temp) }}<span class="text-3xl sm:text-4xl font-bold" :class="isDark ? 'text-slate-500' : 'text-slate-400'">°C</span>
          </div>
          <div class="text-sm mt-2.5 flex items-center gap-2" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="opacity-50">
              <path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"/>
            </svg>
            Feels like {{ Math.round(data.main?.feels_like) }}°C
          </div>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div v-for="stat in stats" :key="stat.label"
          class="text-center rounded-2xl transition-all duration-300"
          :class="isDark ? 'stat-pill hover:bg-white/[.08]' : 'stat-pill-light hover:bg-slate-50'">
          <div class="flex items-center justify-center gap-1.5 mb-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" class="text-teal opacity-60" v-html="stat.iconPath"></svg>
            <span class="text-[11px] font-semibold uppercase tracking-wider"
              :class="isDark ? 'text-slate-500' : 'text-slate-400'">
              {{ stat.label }}
            </span>
          </div>
          <div class="text-sm font-bold" :class="isDark ? 'text-white' : 'text-navy'">
            {{ stat.value }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'
import { useFavoritesStore } from '../store/favorites'
import { getWeatherIcon } from '../services/weatherApi'

const props = defineProps({
  data: { type: Object, required: true },
  showFav: { type: Boolean, default: true },
})

const themeStore = useThemeStore()
const favStore = useFavoritesStore()

const isDark = computed(() => themeStore.isDark)
const isFav = computed(() => favStore.isFavorite(props.data.name))
const description = computed(() => props.data.weather?.[0]?.description || '')
const iconUrl = computed(() => getWeatherIcon(props.data.weather?.[0]?.icon || '01d'))

const conditionId = computed(() => props.data.weather?.[0]?.id || 800)

const accentColor = computed(() => {
  const id = conditionId.value
  if (id >= 200 && id < 300) return '#8B5CF6'
  if (id >= 300 && id < 600) return '#38BDF8'
  if (id >= 600 && id < 700) return '#E0E7FF'
  if (id >= 700 && id < 800) return '#94A3B8'
  if (id === 800) return '#F59E0B'
  return '#14B8A6'
})

const accentGradient = computed(() => {
  const id = conditionId.value
  if (id >= 200 && id < 300) return 'linear-gradient(90deg, #8B5CF6, #A78BFA, #C4B5FD)'
  if (id >= 300 && id < 600) return 'linear-gradient(90deg, #0EA5E9, #38BDF8, #7DD3FC)'
  if (id >= 600 && id < 700) return 'linear-gradient(90deg, #CBD5E1, #E2E8F0, #F1F5F9)'
  if (id >= 700 && id < 800) return 'linear-gradient(90deg, #64748B, #94A3B8, #CBD5E1)'
  if (id === 800) return 'linear-gradient(90deg, #F59E0B, #FBBF24, #FDE68A)'
  return 'linear-gradient(90deg, #14B8A6, #2DD4BF, #06B6D4)'
})

const stats = computed(() => [
  { label: 'Humidity', value: `${props.data.main?.humidity}%`, iconPath: '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>' },
  { label: 'Wind', value: `${props.data.wind?.speed} m/s`, iconPath: '<path d="M9.59 4.59A2 2 0 1 1 11 8H2m10.59 11.41A2 2 0 1 0 14 16H2m15.73-8.27A2.5 2.5 0 1 1 19.5 12H2"/>' },
  { label: 'Pressure', value: `${props.data.main?.pressure} hPa`, iconPath: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>' },
  { label: 'Visibility', value: `${((props.data.visibility || 0) / 1000).toFixed(1)} km`, iconPath: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>' },
])

function toggleFav() {
  if (isFav.value) favStore.removeCity(props.data.name)
  else favStore.addCity(props.data.name)
}
</script>
