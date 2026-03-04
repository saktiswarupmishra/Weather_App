<template>
  <div class="min-h-screen relative"
    :class="isDark ? 'page-bg-dark' : 'page-bg-light'">
    <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <!-- Header -->
      <div class="mb-8 animate-slide-up">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="isDark ? 'bg-white/[.05]' : 'bg-white shadow-sm shadow-black/[.04]'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-teal">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <h1 class="text-3xl font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">
            Weather Forecast
          </h1>
        </div>
        <p class="text-sm ml-[52px]" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Detailed forecast with temperature and humidity trends
        </p>
      </div>

      <!-- Search -->
      <div class="max-w-xl mb-10 animate-slide-up" style="animation-delay: 0.1s;">
        <SearchBar @search="onSearch" @coords="onCoords" />
      </div>

      <template v-if="loading">
        <LoadingSkeleton :count="2" />
      </template>

      <template v-else-if="forecast">
        <!-- City Info Header -->
        <div class="glass-card overflow-hidden mb-8 animate-scale-in" :class="isDark ? '' : 'glass-card-light'">
          <div class="accent-line w-full"></div>
          <div class="p-6 sm:p-8">
            <h2 class="text-2xl sm:text-3xl font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">
              {{ forecast.city?.name }}<span class="text-slate-400 font-normal text-lg ml-2">{{ forecast.city?.country }}</span>
            </h2>
            <div class="flex items-center gap-4 mt-2.5">
              <span class="text-sm flex items-center gap-1.5" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75" stroke-linecap="round"/></svg>
                Pop: {{ forecast.city?.population?.toLocaleString() || 'N/A' }}
              </span>
              <span class="text-sm flex items-center gap-1.5" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ forecast.city?.coord?.lat?.toFixed(2) }}°, {{ forecast.city?.coord?.lon?.toFixed(2) }}°
              </span>
            </div>
          </div>
        </div>

        <!-- 5-Day Overview -->
        <div class="mb-10 animate-slide-up" style="animation-delay: 0.1s;">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="isDark ? 'bg-white/[.05]' : 'bg-white shadow-sm shadow-black/[.04]'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-teal">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h3 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-navy'">5-Day Overview</h3>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <ForecastCard v-for="day in forecastDays" :key="day.dt" :day="day" />
          </div>
        </div>

        <!-- Charts -->
        <div class="space-y-6 animate-slide-up" style="animation-delay: 0.2s;">
          <HourlyChart :labels="hourlyLabels" :data="hourlyTemps" title="Temperature Trend (Next 24h)" />
          <HourlyChart :labels="hourlyLabels" :data="hourlyHumidity" title="Humidity Trend (Next 24h)"
            color="#06B6D4" unit="%" />
          <HourlyChart :labels="hourlyLabels" :data="hourlyWind" title="Wind Speed Trend (Next 24h)"
            color="#F59E0B" unit=" m/s" />
        </div>
      </template>

      <!-- Empty state -->
      <div v-else-if="!loading" class="text-center mt-20 animate-fade-in">
        <div class="relative inline-block mb-6">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"
            class="opacity-10" :class="isDark ? 'text-white' : 'text-navy'">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
          </svg>
        </div>
        <h2 class="text-xl font-display font-bold mb-2" :class="isDark ? 'text-white' : 'text-navy'">
          No forecast loaded
        </h2>
        <p :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Search for a city to view detailed forecast data
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../store/theme'
import { getForecast, getForecastByCoords } from '../services/weatherApi'
import SearchBar from '../components/SearchBar.vue'
import ForecastCard from '../components/ForecastCard.vue'
import HourlyChart from '../components/HourlyChart.vue'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const forecast = ref(null)
const loading = ref(false)

const forecastDays = computed(() => {
  if (!forecast.value?.list) return []
  const days = {}
  forecast.value.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!days[date]) days[date] = item
  })
  return Object.values(days).slice(0, 5)
})

const hourlyLabels = computed(() =>
  forecast.value?.list?.slice(0, 8).map(i =>
    new Date(i.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit' })
  ) || []
)
const hourlyTemps = computed(() =>
  forecast.value?.list?.slice(0, 8).map(i => Math.round(i.main.temp)) || []
)
const hourlyHumidity = computed(() =>
  forecast.value?.list?.slice(0, 8).map(i => i.main.humidity) || []
)
const hourlyWind = computed(() =>
  forecast.value?.list?.slice(0, 8).map(i => i.wind.speed) || []
)

async function onSearch(city) {
  loading.value = true
  try {
    forecast.value = await getForecast(city)
  } catch { forecast.value = null }
  finally { loading.value = false }
}

async function onCoords({ lat, lon }) {
  loading.value = true
  try {
    forecast.value = await getForecastByCoords(lat, lon)
  } catch { forecast.value = null }
  finally { loading.value = false }
}
</script>
