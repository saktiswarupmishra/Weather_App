<template>
  <div class="glass-card p-6" :class="isDark ? '' : 'glass-card-light'">
    <h3 class="text-sm font-semibold mb-5 flex items-center gap-2.5" :class="isDark ? 'text-white' : 'text-navy'">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="isDark ? 'bg-emerald/10' : 'bg-emerald/8'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald">
          <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      Air Quality Index
    </h3>

    <div v-if="aqi">
      <!-- AQI Value and Label -->
      <div class="flex items-center gap-4 mb-5">
        <div class="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold text-white shadow-lg relative overflow-hidden"
          :style="{ background: `linear-gradient(135deg, ${aqiColor}, ${aqiColor}cc)`, boxShadow: `0 8px 24px ${aqiColor}25` }">
          {{ aqiValue }}
          <div class="absolute inset-0 bg-white/10 rounded-2xl"></div>
        </div>
        <div>
          <div class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-navy'">{{ aqiLabel }}</div>
          <div class="text-xs mt-0.5" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            Air Quality Level
          </div>
        </div>
      </div>

      <!-- Gauge Bar -->
      <div class="relative mb-5">
        <div class="h-2.5 rounded-full overflow-hidden" :class="isDark ? 'bg-white/[.08]' : 'bg-slate-100'">
          <div class="h-full rounded-full bg-gradient-to-r from-emerald via-gold to-rose transition-all duration-1000 ease-out"
            :style="{ width: gaugeWidth + '%' }">
          </div>
        </div>
        <div class="flex justify-between mt-2">
          <span class="text-[10px] font-medium" :class="isDark ? 'text-slate-600' : 'text-slate-400'">Good</span>
          <span class="text-[10px] font-medium" :class="isDark ? 'text-slate-600' : 'text-slate-400'">Very Poor</span>
        </div>
      </div>

      <!-- Pollutant Breakdown -->
      <div class="grid grid-cols-2 gap-2.5">
        <div v-for="p in pollutants" :key="p.label"
          class="rounded-xl p-3 flex items-center justify-between transition-all duration-300"
          :class="isDark ? 'bg-white/[.04] hover:bg-white/[.07]' : 'bg-slate-50/80 hover:bg-slate-100/80'">
          <span class="text-[11px] font-semibold" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            {{ p.label }}
          </span>
          <span class="text-xs font-bold" :class="isDark ? 'text-white' : 'text-navy'">
            {{ p.value }}
          </span>
        </div>
      </div>
    </div>

    <div v-else class="flex flex-col items-center py-6">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="opacity-15 mb-3">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
      <div class="text-sm" :class="isDark ? 'text-slate-500' : 'text-slate-400'">AQI data unavailable</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

const props = defineProps({
  aqi: { type: Object, default: null },
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const aqiValue = computed(() => props.aqi?.list?.[0]?.main?.aqi || 0)
const components = computed(() => props.aqi?.list?.[0]?.components || {})

const pm25 = computed(() => components.value.pm2_5?.toFixed(1) || '-')
const pm10 = computed(() => components.value.pm10?.toFixed(1) || '-')
const no2 = computed(() => components.value.no2?.toFixed(1) || '-')
const o3 = computed(() => components.value.o3?.toFixed(1) || '-')

const aqiLabels = ['', 'Good', 'Fair', 'Moderate', 'Poor', 'Very Poor']
const aqiColors = ['', '#10B981', '#84cc16', '#F59E0B', '#F97316', '#EF4444']

const aqiLabel = computed(() => aqiLabels[aqiValue.value] || 'Unknown')
const aqiColor = computed(() => aqiColors[aqiValue.value] || '#64748b')

const gaugeWidth = computed(() => (aqiValue.value / 5) * 100)

const pollutants = computed(() => [
  { label: 'PM2.5', value: `${pm25.value} µg/m³` },
  { label: 'PM10', value: `${pm10.value} µg/m³` },
  { label: 'NO₂', value: `${no2.value} µg/m³` },
  { label: 'O₃', value: `${o3.value} µg/m³` },
])
</script>
