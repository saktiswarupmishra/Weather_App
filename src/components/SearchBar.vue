<template>
  <div class="relative w-full max-w-xl mx-auto" ref="containerRef">
    <div class="relative flex items-center group">
      <!-- Search Icon -->
      <div class="absolute left-4.5 transition-colors duration-300"
        :class="focused ? 'text-teal' : (isDark ? 'text-slate-500' : 'text-slate-400')">
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="8.5" cy="8.5" r="6"/><path d="M14 14l4 4"/>
        </svg>
      </div>
      <input
        ref="inputRef"
        v-model="query"
        type="text"
        placeholder="Search any city worldwide..."
        class="w-full pl-12 pr-28 py-4 rounded-2xl text-[15px] font-medium transition-all duration-400 outline-none"
        :class="isDark
          ? 'bg-white/[.06] text-white placeholder-slate-500 border border-white/[.07]'
          : 'bg-white text-navy placeholder-slate-400 border border-slate-200/80 shadow-sm shadow-black/[.02]'"
        :style="focused ? focusStyle : ''"
        @focus="focused = true; showDropdown = true"
        @blur="onBlur"
        @keydown.enter="onEnter"
      />
      <div class="absolute right-2 flex items-center gap-1">
        <button v-if="query" @click="query = ''; suggestions = []"
          class="p-2 rounded-xl transition-all duration-300"
          :class="isDark ? 'text-slate-500 hover:text-white hover:bg-white/10' : 'text-slate-400 hover:text-navy hover:bg-slate-50'">
          <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <path d="M4 4l8 8M4 12l8-8"/>
          </svg>
        </button>
        <button @click="onGeolocate"
          class="p-2.5 rounded-xl transition-all duration-300"
          :class="[
            geoLoading ? 'text-teal' : (isDark ? 'text-slate-500 hover:text-teal' : 'text-slate-400 hover:text-teal-dark'),
            isDark ? 'hover:bg-white/10' : 'hover:bg-slate-50'
          ]"
          title="Use my location">
          <svg v-if="!geoLoading" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="8" cy="8" r="3"/><path d="M8 1v3M8 11v3M1 8h3M11 8h3"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
      <!-- Focus Glow Ring -->
      <div class="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-500"
        :class="focused ? 'opacity-100' : 'opacity-0'"
        :style="{ boxShadow: isDark ? '0 0 0 2px rgba(20,184,166,0.2), 0 0 30px rgba(20,184,166,0.06)' : '0 0 0 2px rgba(20,184,166,0.15), 0 0 20px rgba(20,184,166,0.04)' }">
      </div>
    </div>

    <!-- Autocomplete Dropdown -->
    <transition name="view">
      <div v-if="showDropdown && (suggestions.length || loading)"
        class="absolute top-full left-0 right-0 mt-2.5 rounded-2xl overflow-hidden z-50"
        :class="isDark ? 'glass' : 'bg-white/95 backdrop-blur-xl border border-slate-200/60'"
        :style="{ boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.4)' : '0 20px 60px rgba(0,0,0,0.08)' }">
        <div v-if="loading" class="p-4 text-center text-sm flex items-center justify-center gap-2"
          :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="animate-spin">
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"/>
          </svg>
          Searching...
        </div>
        <button v-for="(s, i) in suggestions" :key="i"
          class="w-full px-4 py-3.5 text-left text-sm transition-all duration-200 flex items-center gap-3"
          :class="isDark
            ? 'text-white hover:bg-white/[.06] border-b border-white/[.04] last:border-0'
            : 'text-navy hover:bg-slate-50 border-b border-slate-100 last:border-0'"
          @mousedown.prevent="selectCity(s)">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center"
            :class="isDark ? 'bg-teal/10 text-teal' : 'bg-teal/8 text-teal-dark'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <div class="font-medium">{{ s.name }}</div>
            <div class="text-xs mt-0.5" :class="isDark ? 'text-slate-500' : 'text-slate-400'">{{ s.state ? s.state + ', ' : '' }}{{ s.country }}</div>
          </div>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useThemeStore } from '../store/theme'
import { useDebounce } from '../composables/useDebounce'
import { useGeolocation } from '../composables/useGeolocation'
import { getCityAutocomplete } from '../services/weatherApi'

const emit = defineEmits(['search', 'coords'])
const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const query = ref('')
const suggestions = ref([])
const showDropdown = ref(false)
const loading = ref(false)
const focused = ref(false)
const inputRef = ref(null)
const containerRef = ref(null)
const debouncedQuery = useDebounce(query, 350)

const { detect, loading: geoLoading } = useGeolocation()

const focusStyle = computed(() => ({
  borderColor: isDark.value ? 'rgba(20,184,166,0.35)' : 'rgba(20,184,166,0.25)',
  background: isDark.value ? 'rgba(255,255,255,0.08)' : '#ffffff',
}))

watch(debouncedQuery, async (val) => {
  if (!val || val.length < 2) { suggestions.value = []; return }
  loading.value = true
  try {
    suggestions.value = await getCityAutocomplete(val)
  } catch { suggestions.value = [] }
  finally { loading.value = false }
})

function selectCity(s) {
  query.value = s.name
  showDropdown.value = false
  suggestions.value = []
  emit('search', s.name)
}

function onEnter() {
  if (query.value.trim()) {
    showDropdown.value = false
    suggestions.value = []
    emit('search', query.value.trim())
  }
}

function onBlur() {
  focused.value = false
  setTimeout(() => { showDropdown.value = false }, 200)
}

async function onGeolocate() {
  try {
    const c = await detect()
    emit('coords', c)
  } catch (e) {
    console.error('Geolocation error', e)
  }
}
</script>
