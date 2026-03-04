<template>
  <div class="glass-card p-6" :class="isDark ? '' : 'glass-card-light'">
    <h3 class="text-lg font-display font-semibold mb-5 flex items-center gap-2.5" :class="isDark ? 'text-white' : 'text-navy'">
      <div class="w-8 h-8 rounded-lg flex items-center justify-center" :class="isDark ? 'bg-white/[.05]' : 'bg-slate-50'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" :style="{ color: chartColor }">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
        </svg>
      </div>
      {{ title }}
    </h3>
    <div class="chart-container">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js'
import { useThemeStore } from '../store/theme'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const props = defineProps({
  labels: { type: Array, required: true },
  data: { type: Array, required: true },
  title: { type: String, default: 'Hourly Temperature' },
  color: { type: String, default: '#14B8A6' },
  unit: { type: String, default: '°C' },
})

const themeStore = useThemeStore()
const isDark = computed(() => themeStore.isDark)
const chartColor = computed(() => props.color)

const chartData = computed(() => ({
  labels: props.labels,
  datasets: [{
    label: props.title,
    data: props.data,
    borderColor: props.color,
    backgroundColor: (ctx) => {
      if (!ctx.chart.chartArea) return props.color + '15'
      const gradient = ctx.chart.ctx.createLinearGradient(0, ctx.chart.chartArea.top, 0, ctx.chart.chartArea.bottom)
      gradient.addColorStop(0, props.color + '25')
      gradient.addColorStop(0.5, props.color + '08')
      gradient.addColorStop(1, props.color + '01')
      return gradient
    },
    borderWidth: 2.5,
    pointRadius: 4,
    pointHoverRadius: 7,
    pointBackgroundColor: props.color,
    pointBorderColor: isDark.value ? '#0a1929' : '#ffffff',
    pointBorderWidth: 2.5,
    pointHoverBackgroundColor: props.color,
    pointHoverBorderColor: '#ffffff',
    pointHoverBorderWidth: 3,
    tension: 0.4,
    fill: true,
  }],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: { mode: 'index', intersect: false },
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: isDark.value ? 'rgba(5, 13, 22, 0.95)' : 'rgba(255, 255, 255, 0.97)',
      titleColor: isDark.value ? '#f1f5f9' : '#0f172a',
      bodyColor: isDark.value ? '#94a3b8' : '#64748b',
      borderColor: props.color + '30',
      borderWidth: 1,
      cornerRadius: 12,
      padding: { top: 12, bottom: 12, left: 16, right: 16 },
      titleFont: { size: 12, weight: 600, family: "'Inter', sans-serif" },
      bodyFont: { size: 13, weight: 500, family: "'Inter', sans-serif" },
      boxPadding: 4,
      usePointStyle: true,
      callbacks: {
        label: (ctx) => ` ${ctx.parsed.y}${props.unit}`,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: isDark.value ? '#475569' : '#94a3b8',
        font: { size: 11, weight: 500, family: "'Inter', sans-serif" },
        padding: 10,
      },
    },
    y: {
      grid: {
        color: isDark.value ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)',
        drawBorder: false,
      },
      border: { display: false },
      ticks: {
        color: isDark.value ? '#475569' : '#94a3b8',
        font: { size: 11, weight: 500, family: "'Inter', sans-serif" },
        padding: 14,
        callback: (v) => `${v}${props.unit}`,
      },
    },
  },
}))
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
}
</style>
