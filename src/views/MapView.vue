<template>
  <div class="min-h-screen relative"
    :class="isDark ? 'page-bg-dark' : 'page-bg-light'">
    <div class="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-8">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div class="animate-slide-up">
          <div class="flex items-center gap-3 mb-1">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="isDark ? 'bg-white/[.05]' : 'bg-white shadow-sm shadow-black/[.04]'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-teal">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/>
                <line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/>
              </svg>
            </div>
            <h1 class="text-3xl font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">
              Global Weather Map
            </h1>
          </div>
          <p class="text-sm ml-[52px]" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            Click anywhere on the map to get real-time weather data
          </p>
        </div>
        <div class="w-full sm:w-96 animate-slide-up" style="animation-delay: 0.1s;">
          <SearchBar @search="onSearch" @coords="onCoords" />
        </div>
      </div>

      <!-- Map -->
      <div class="glass-card overflow-hidden animate-slide-up" :class="isDark ? '' : 'glass-card-light'"
        style="padding: 0;">
        <WeatherMap
          ref="mapRef"
          :center="mapCenter"
          :zoom="3"
          :marker-city="selectedCity"
          @city-click="onCityClick"
          class="w-full"
          style="height: 70vh; border-radius: 1.25rem;"
        />
      </div>

      <!-- Selected City Card -->
      <transition name="view">
        <div v-if="selectedCity" class="mt-6 animate-scale-in">
          <WeatherCard :data="selectedCity" />
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useThemeStore } from '../store/theme'
import { getCurrentWeather, getWeatherByCoords } from '../services/weatherApi'
import WeatherMap from '../components/WeatherMap.vue'
import WeatherCard from '../components/WeatherCard.vue'
import SearchBar from '../components/SearchBar.vue'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const mapCenter = ref([20, 0])
const selectedCity = ref(null)
const mapRef = ref(null)

function onCityClick(data) {
  selectedCity.value = data
}

async function onSearch(city) {
  try {
    const data = await getCurrentWeather(city)
    selectedCity.value = data
  } catch (e) {
    console.error('Search error:', e)
  }
}

async function onCoords({ lat, lon }) {
  try {
    const data = await getWeatherByCoords(lat, lon)
    selectedCity.value = data
  } catch (e) {
    console.error('Coords error:', e)
  }
}
</script>
