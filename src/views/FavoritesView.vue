<template>
  <div class="min-h-screen relative"
    :class="isDark ? 'page-bg-dark' : 'page-bg-light'">
    <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <!-- Header -->
      <div class="flex items-center justify-between mb-8 animate-slide-up">
        <div>
          <div class="flex items-center gap-3 mb-1">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center"
              :class="isDark ? 'bg-white/[.05]' : 'bg-white shadow-sm shadow-black/[.04]'">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gold">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
              </svg>
            </div>
            <h1 class="text-3xl font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">
              Favorite Cities
            </h1>
          </div>
          <p class="text-sm ml-[52px]" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            {{ favStore.cities.length }} {{ favStore.cities.length === 1 ? 'city' : 'cities' }} saved
          </p>
        </div>
      </div>

      <!-- Loading -->
      <LoadingSkeleton v-if="loading" :count="3" />

      <!-- Favorites Grid -->
      <div v-else-if="favWeather.length" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div v-for="(w, i) in favWeather" :key="w.name" class="animate-slide-up"
          :style="{ animationDelay: `${i * 0.1}s` }">
          <WeatherCard :data="w" :show-fav="true" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center mt-20 animate-fade-in">
        <div class="relative inline-block mb-8">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.8"
            class="opacity-10" :class="isDark ? 'text-white' : 'text-navy'">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.56 5.82 22 7 14.14l-5-4.87 6.91-1.01L12 2z"/>
          </svg>
          <div class="absolute inset-0 rounded-full bg-gold/5 blur-2xl"></div>
        </div>
        <h2 class="text-xl font-display font-bold mb-2" :class="isDark ? 'text-white' : 'text-navy'">
          No favorites yet
        </h2>
        <p class="mb-10 max-w-sm mx-auto" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          Search for cities and save them as favorites for quick access
        </p>
        <router-link to="/"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg text-white bg-gradient-to-r from-teal to-cyan hover:shadow-teal/20">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="10" cy="10" r="7"/><path d="M15 15l4 4"/>
          </svg>
          Explore Weather
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useThemeStore } from '../store/theme'
import { useFavoritesStore } from '../store/favorites'
import { getCurrentWeather } from '../services/weatherApi'
import WeatherCard from '../components/WeatherCard.vue'
import LoadingSkeleton from '../components/LoadingSkeleton.vue'

const themeStore = useThemeStore()
const favStore = useFavoritesStore()
const isDark = computed(() => themeStore.isDark)

const favWeather = ref([])
const loading = ref(false)

async function loadFavorites() {
  if (!favStore.cities.length) { favWeather.value = []; return }
  loading.value = true
  try {
    const results = await Promise.allSettled(
      favStore.cities.map(city => getCurrentWeather(city))
    )
    favWeather.value = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value)
  } catch { favWeather.value = [] }
  finally { loading.value = false }
}

onMounted(loadFavorites)
watch(() => favStore.cities.length, loadFavorites)
</script>
