<template>
  <div class="glass-card p-6" :class="isDark ? '' : 'glass-card-light'">
    <h3 class="text-sm font-semibold mb-5 flex items-center gap-2.5" :class="isDark ? 'text-white' : 'text-navy'">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="isDark ? 'bg-gold/10' : 'bg-gold/8'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-gold">
          <circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M16.36 7.64l1.42-1.42" stroke-linecap="round"/>
        </svg>
      </div>
      Sunrise & Sunset
    </h3>

    <!-- SVG Arc Visualization -->
    <div class="relative mx-auto" style="max-width: 340px;">
      <svg viewBox="0 0 300 130" class="w-full">
        <!-- Arc Path -->
        <path d="M 30 110 Q 150 -10 270 110" fill="none"
          :stroke="isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'" stroke-width="2" stroke-dasharray="6 4"/>

        <!-- Filled Arc (progress) -->
        <path d="M 30 110 Q 150 -10 270 110" fill="none"
          stroke="url(#sunGradient)" stroke-width="3" stroke-linecap="round"
          :stroke-dasharray="arcLength"
          :stroke-dashoffset="arcOffset"/>

        <!-- Gradient Definition -->
        <defs>
          <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="50%" stop-color="#F43F5E"/>
            <stop offset="100%" stop-color="#8B5CF6"/>
          </linearGradient>
          <radialGradient id="sunGlow">
            <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.6"/>
            <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
          </radialGradient>
        </defs>

        <!-- Sun Position Dot -->
        <circle :cx="sunX" :cy="sunY" r="16" fill="url(#sunGlow)" class="animate-breathe"/>
        <circle :cx="sunX" :cy="sunY" r="7" fill="#F59E0B" stroke="#FBBF24" stroke-width="2" filter="drop-shadow(0 0 8px rgba(245,158,11,0.5))"/>

        <!-- Horizon Line -->
        <line x1="15" y1="110" x2="285" y2="110"
          :stroke="isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'" stroke-width="1"/>

        <!-- Sunrise Label -->
        <text x="30" y="128" text-anchor="middle"
          :fill="isDark ? '#94a3b8' : '#64748b'" font-size="10" font-weight="500">
          {{ sunrise }}
        </text>

        <!-- Sunset Label -->
        <text x="270" y="128" text-anchor="middle"
          :fill="isDark ? '#94a3b8' : '#64748b'" font-size="10" font-weight="500">
          {{ sunset }}
        </text>
      </svg>
    </div>

    <!-- Times -->
    <div class="flex items-center justify-between mt-4 px-2">
      <div class="flex items-center gap-2">
        <div class="w-2.5 h-2.5 rounded-full bg-gold shadow-sm shadow-gold/30"></div>
        <span class="text-xs font-medium" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Sunrise</span>
        <span class="text-sm font-bold text-gold">{{ sunrise }}</span>
      </div>
      <div class="text-xs font-semibold px-3 py-1.5 rounded-full"
        :class="isDark ? 'bg-white/[.05] text-slate-400' : 'bg-slate-100 text-slate-500'">
        {{ dayLength }}
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm font-bold text-rose">{{ sunset }}</span>
        <span class="text-xs font-medium" :class="isDark ? 'text-slate-400' : 'text-slate-500'">Sunset</span>
        <div class="w-2.5 h-2.5 rounded-full bg-rose shadow-sm shadow-rose/30"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

const props = defineProps({
  sunriseTs: { type: Number, required: true },
  sunsetTs: { type: Number, required: true },
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

function formatTime(ts) {
  return new Date(ts * 1000).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

const sunrise = computed(() => formatTime(props.sunriseTs))
const sunset = computed(() => formatTime(props.sunsetTs))

const progress = computed(() => {
  const now = Date.now() / 1000
  if (now < props.sunriseTs) return 0
  if (now > props.sunsetTs) return 1
  return (now - props.sunriseTs) / (props.sunsetTs - props.sunriseTs)
})

const dayLength = computed(() => {
  const diff = props.sunsetTs - props.sunriseTs
  const hours = Math.floor(diff / 3600)
  const mins = Math.floor((diff % 3600) / 60)
  return `${hours}h ${mins}m`
})

const arcLength = 340
const arcOffset = computed(() => arcLength * (1 - progress.value))

const sunX = computed(() => {
  const t = progress.value
  return (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 150 + t * t * 270
})
const sunY = computed(() => {
  const t = progress.value
  return (1 - t) * (1 - t) * 110 + 2 * (1 - t) * t * -10 + t * t * 110
})
</script>
