<template>
  <div class="min-h-screen relative"
    :class="isDark ? 'page-bg-dark' : 'page-bg-light'">
    <div class="pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pb-16">
      <!-- Header -->
      <div class="mb-8 animate-slide-up">
        <div class="flex items-center gap-3 mb-1">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center"
            :class="isDark ? 'bg-white/[.05]' : 'bg-white shadow-sm shadow-black/[.04]'">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" class="text-rose">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
          </div>
          <h1 class="text-3xl font-display font-bold" :class="isDark ? 'text-white' : 'text-navy'">
            Weather Alerts & Intelligence
          </h1>
        </div>
        <p class="text-sm ml-[52px]" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
          AI-powered insights and severe weather notifications
        </p>
      </div>

      <!-- AI Recommendations -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div v-for="(rec, i) in recommendations" :key="rec.title"
          class="glass-card card-hover p-6 animate-slide-up"
          :class="isDark ? '' : 'glass-card-light'"
          :style="{ animationDelay: `${i * 0.1}s` }">
          <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
            :style="{ background: rec.iconBg }">
            <span class="text-2xl">{{ rec.icon }}</span>
          </div>
          <h3 class="text-base font-bold mb-2" :class="isDark ? 'text-white' : 'text-navy'">
            {{ rec.title }}
          </h3>
          <p class="text-sm leading-relaxed mb-4" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            {{ rec.description }}
          </p>
          <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider"
            :style="{ background: rec.tagBg, color: rec.tagColor }">
            <div class="w-1.5 h-1.5 rounded-full" :style="{ background: rec.tagColor }"></div>
            {{ rec.tag }}
          </span>
        </div>
      </div>

      <!-- Severe Weather Alert Section -->
      <div class="glass-card p-6 sm:p-8 animate-slide-up" :class="isDark ? '' : 'glass-card-light'"
        style="animation-delay: 0.3s;">
        <h3 class="text-lg font-bold mb-6 flex items-center gap-3"
          :class="isDark ? 'text-white' : 'text-navy'">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="isDark ? 'bg-emerald/10' : 'bg-emerald/8'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          Alert Status
        </h3>
        <div class="text-center py-10">
          <div class="w-16 h-16 rounded-full bg-emerald/8 flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-emerald">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <p class="font-bold text-lg mb-1" :class="isDark ? 'text-white' : 'text-navy'">All Clear</p>
          <p class="text-sm max-w-sm mx-auto" :class="isDark ? 'text-slate-400' : 'text-slate-500'">
            No active severe weather alerts for your saved locations
          </p>
        </div>
      </div>

      <!-- Future Features -->
      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div v-for="(feature, i) in futureFeatures" :key="feature.title"
          class="rounded-2xl p-5 border border-dashed transition-all duration-300 animate-slide-up"
          :class="isDark ? 'border-white/[.06] hover:border-white/[.12] bg-white/[.02] hover:bg-white/[.04]' : 'border-slate-200/80 hover:border-slate-300 bg-white/40 hover:bg-white/60'"
          :style="{ animationDelay: `${0.4 + i * 0.1}s` }">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              :class="isDark ? 'bg-white/[.05]' : 'bg-slate-50'">
              {{ feature.icon }}
            </div>
            <h3 class="font-semibold flex-1" :class="isDark ? 'text-white' : 'text-navy'">{{ feature.title }}</h3>
            <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal/10 text-teal">
              Soon
            </span>
          </div>
          <p class="text-sm ml-[52px]" :class="isDark ? 'text-slate-500' : 'text-slate-400'">
            {{ feature.desc }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '../store/theme'

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)

const recommendations = [
  {
    icon: '👔',
    title: 'Smart Clothing',
    description: 'Based on current weather, we recommend light layers with a waterproof jacket. UV index is moderate.',
    tag: 'AI Powered',
    tagBg: 'rgba(20, 184, 166, 0.12)',
    tagColor: '#14B8A6',
    iconBg: 'rgba(20, 184, 166, 0.08)',
  },
  {
    icon: '✈️',
    title: 'Travel Advice',
    description: 'Perfect weather for outdoor activities. Consider visiting coastal areas for ideal conditions.',
    tag: 'Suggestion',
    tagBg: 'rgba(6, 182, 212, 0.12)',
    tagColor: '#06B6D4',
    iconBg: 'rgba(6, 182, 212, 0.08)',
  },
  {
    icon: '🛡️',
    title: 'Risk Assessment',
    description: 'Low risk of severe weather in your area. No flood or storm warnings for the next 48 hours.',
    tag: 'Safe',
    tagBg: 'rgba(16, 185, 129, 0.12)',
    tagColor: '#10B981',
    iconBg: 'rgba(16, 185, 129, 0.08)',
  },
]

const futureFeatures = [
  { icon: '📡', title: 'Real-Time WebSocket Feed', desc: 'Live weather updates pushed to your dashboard.' },
  { icon: '🤖', title: 'ML Weather Predictions', desc: 'Machine learning models for hyper-local forecasts.' },
  { icon: '📱', title: 'Push Notifications', desc: 'Get alerted about severe weather before it happens.' },
  { icon: '📈', title: 'Climate Analytics', desc: 'Historical trends and anomaly detection analysis.' },
]
</script>
