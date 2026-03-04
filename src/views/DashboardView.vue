<template>
  <div class="min-h-screen relative overflow-hidden">
    <!-- Dynamic Background -->
    <div class="fixed inset-0 transition-all duration-1000 -z-10" :style="{ background: bgGradient }"></div>
    <WeatherBackground :type="particleType" />

    <!-- Content -->
    <div class="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <!-- Hero Section -->
      <div class="text-center mb-16 animate-slide-up">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-wide"
          :class="isDark ? 'bg-white/[.05] text-teal-light border border-white/[.05]' : 'bg-white/60 text-teal-dark border border-teal/10 shadow-sm'">
          <div class="w-1.5 h-1.5 rounded-full bg-teal animate-breathe"></div>
          LIVE WEATHER DATA
        </div>
        <h1 class="text-4xl sm:text-5xl lg:text-7xl font-display font-extrabold tracking-tight mb-5 leading-[1.1]">
          <span :class="isDark ? 'text-white' : 'text-navy'" :style="!isDark ? 'text-shadow: 0 1px 2px rgba(0,0,0,0.04)' : ''">Weather </span>
          <span class="text-gradient">Intelligence</span>
        </h1>
        <p class="text-lg max-w-2xl mx-auto mb-12" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Explore real-time weather data from anywhere on the planet
        </p>
        <SearchBar @search="onSearch" @coords="onCoords" />
      </div>

      <!-- Error -->
      <transition name="view">
        <div v-if="weatherStore.error"
          class="max-w-xl mx-auto mb-8 glass-card p-5 text-center"
          :class="isDark ? 'border-rose/20' : 'glass-card-light border-rose/20'">
          <div class="flex items-center justify-center gap-2 mb-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-rose">
              <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
            <p class="text-rose font-medium text-sm">{{ weatherStore.error }}</p>
          </div>
          <button @click="weatherStore.clearError()"
            class="text-xs font-medium transition-all duration-200"
            :class="isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-navy'">
            Dismiss
          </button>
        </div>
      </transition>

      <!-- Loading -->
      <LoadingSkeleton v-if="weatherStore.loading" />

      <!-- Weather Content -->
      <template v-if="weatherStore.currentWeather && !weatherStore.loading">
        <div class="animate-slide-up" style="animation-delay: 0.1s;">
          <WeatherCard :data="weatherStore.currentWeather" />
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div class="animate-slide-up" style="animation-delay: 0.2s;">
            <SunriseSunset
              v-if="weatherStore.currentWeather.sys"
              :sunrise-ts="weatherStore.currentWeather.sys.sunrise"
              :sunset-ts="weatherStore.currentWeather.sys.sunset" />
          </div>
          <div class="animate-slide-up" style="animation-delay: 0.3s;">
            <AirQualityCard :aqi="weatherStore.airQuality" />
          </div>
        </div>

        <!-- Quick Forecast -->
        <div v-if="forecastDays.length" class="mt-10 animate-slide-up" style="animation-delay: 0.4s;">
          <div class="flex items-center gap-3 mb-5">
            <div class="w-8 h-8 rounded-lg flex items-center justify-center"
              :class="isDark ? 'bg-white/[.05]' : 'bg-white/60 shadow-sm'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-teal">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <h2 class="text-lg font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">5-Day Forecast</h2>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            <ForecastCard v-for="day in forecastDays" :key="day.dt" :day="day" />
          </div>
        </div>

        <!-- Charts -->
        <div v-if="hourlyLabels.length" class="mt-10 animate-slide-up" style="animation-delay: 0.5s;">
          <HourlyChart :labels="hourlyLabels" :data="hourlyTemps" title="24h Temperature" />
        </div>

        <div v-if="hourlyLabels.length" class="mt-6 animate-slide-up" style="animation-delay: 0.6s;">
          <HourlyChart :labels="hourlyLabels" :data="hourlyHumidity" title="24h Humidity"
            color="#06B6D4" unit="%" />
        </div>
      </template>

      <!-- Empty State -->
      <div v-if="!weatherStore.currentWeather && !weatherStore.loading && !weatherStore.error"
        class="text-center mt-16 animate-fade-in">
        <div class="relative inline-block mb-8">
          <div class="text-8xl animate-float">🌍</div>
          <div class="absolute -inset-6 rounded-full bg-gradient-to-br from-teal/8 to-cyan/8 blur-3xl -z-10"></div>
        </div>
        <h2 class="text-2xl sm:text-3xl font-display font-bold mb-3" :class="isDark ? 'text-white' : 'text-navy'">
          Explore Global Weather
        </h2>
        <p class="max-w-md mx-auto mb-10" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Search for any city or use your current location to get started with real-time weather intelligence.
        </p>
        <div class="flex flex-wrap justify-center gap-2.5">
          <button v-for="city in quickCities" :key="city" @click="onSearch(city)"
            class="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300"
            :class="isDark
              ? 'bg-white/[.04] text-slate-300 border border-white/[.05] hover:text-white hover:bg-white/[.08] hover:border-teal/20'
              : 'bg-white/80 text-slate-600 border border-slate-200/60 hover:text-navy hover:bg-white hover:border-teal/25 shadow-sm hover:shadow-md hover:shadow-black/[.03]'">
            {{ city }}
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="relative z-10 border-t py-8 px-4 text-center"
      :class="isDark ? 'border-white/[.04]' : 'border-slate-200/60'">
      <p class="text-xs font-medium" :class="isDark ? 'text-slate-600' : 'text-slate-400'">
        Powered by <a href="https://openweathermap.org" target="_blank" class="text-teal hover:underline font-semibold">OpenWeatherMap</a>
        · Built with Vue.js · © {{ new Date().getFullYear() }} ClimaSphere
      </p>
    </footer>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useWeatherStore } from '../store/weather'
import { useThemeStore } from '../store/theme'
import { useWeatherBackground } from '../composables/useWeatherBackground'
import SearchBar from '../components/SearchBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import ForecastCard from '../components/ForecastCard.vue'
import HourlyChart from '../components/HourlyChart.vue'
import SunriseSunset from '../components/SunriseSunset.vue'
import AirQualityCard from '../components/AirQualityCard.vue'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'
import WeatherBackground from '../components/WeatherBackground.vue'

const weatherStore = useWeatherStore()
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const { backgroundGradient: bgGradient, particleType } = useWeatherBackground(
  computed(() => weatherStore.weatherCondition),
  computed(() => weatherStore.isNight)
)

const quickCities = ['London', 'Tokyo', 'New York', 'Paris', 'Sydney', 'Dubai']

const forecastDays = computed(() => {
  if (!weatherStore.forecast?.list) return []
  const days = {}
  weatherStore.forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString()
    if (!days[date]) days[date] = item
  })
  return Object.values(days).slice(0, 5)
})

const hourlyLabels = computed(() => {
  if (!weatherStore.forecast?.list) return []
  return weatherStore.forecast.list.slice(0, 8).map(item =>
    new Date(item.dt * 1000).toLocaleTimeString('en-US', { hour: '2-digit' })
  )
})

const hourlyTemps = computed(() => {
  if (!weatherStore.forecast?.list) return []
  return weatherStore.forecast.list.slice(0, 8).map(item => Math.round(item.main.temp))
})

const hourlyHumidity = computed(() => {
  if (!weatherStore.forecast?.list) return []
  return weatherStore.forecast.list.slice(0, 8).map(item => item.main.humidity)
})

async function onSearch(city) {
  await weatherStore.fetchWeather(city)
  await weatherStore.fetchForecast(city)
}

async function onCoords({ lat, lon }) {
  await weatherStore.fetchByCoords(lat, lon)
  if (weatherStore.currentCity) {
    await weatherStore.fetchForecast(weatherStore.currentCity)
  }
}

onMounted(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        await onCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude })
      },
      () => { /* User denied, no problem */ }
    )
  }
})
</script>
