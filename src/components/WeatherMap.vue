<template>
  <div ref="mapContainer" class="w-full h-full rounded-2xl overflow-hidden" style="min-height: 500px;"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { getWeatherByCoords, getWeatherIcon } from '../services/weatherApi'

const props = defineProps({
  center: { type: Array, default: () => [20, 0] },
  zoom: { type: Number, default: 3 },
  markerCity: { type: Object, default: null },
})

const emit = defineEmits(['cityClick'])

const mapContainer = ref(null)
let map = null
let clickMarker = null

onMounted(() => {
  map = L.map(mapContainer.value, {
    center: props.center,
    zoom: props.zoom,
    zoomControl: false,
    attributionControl: false,
  })

  // Dark tile layer
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
    subdomains: 'abcd',
  }).addTo(map)

  // Zoom control position
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.control.attribution({ position: 'bottomleft' }).addTo(map)

  // Click to get weather
  map.on('click', async (e) => {
    const { lat, lng } = e.latlng
    try {
      const data = await getWeatherByCoords(lat, lng)
      showPopup(lat, lng, data)
      emit('cityClick', data)
    } catch (err) {
      console.error('Map click error:', err)
    }
  })
})

watch(() => props.markerCity, (city) => {
  if (city && city.coord) {
    const { lat, lon } = city.coord
    map?.setView([lat, lon], 8, { animate: true })
    showPopup(lat, lon, city)
  }
})

function showPopup(lat, lng, data) {
  if (clickMarker) {
    map.removeLayer(clickMarker)
  }

  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="width:40px;height:40px;border-radius:50%;background:rgba(20,184,166,0.3);border:2px solid #14B8A6;display:flex;align-items:center;justify-content:center;">
      <div style="width:12px;height:12px;border-radius:50%;background:#14B8A6;"></div>
    </div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  })

  clickMarker = L.marker([lat, lng], { icon }).addTo(map)

  const popupContent = `
    <div style="min-width:200px;padding:4px;">
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
        <img src="${getWeatherIcon(data.weather?.[0]?.icon || '01d')}" width="40" height="40" />
        <div>
          <div style="font-weight:700;font-size:15px;">${data.name || 'Unknown'}</div>
          <div style="font-size:12px;opacity:0.7;">${data.sys?.country || ''}</div>
        </div>
      </div>
      <div style="font-size:28px;font-weight:800;margin:4px 0;">${Math.round(data.main?.temp)}°C</div>
      <div style="font-size:12px;opacity:0.7;text-transform:capitalize;">${data.weather?.[0]?.description || ''}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:10px;font-size:11px;">
        <div>💧 ${data.main?.humidity}%</div>
        <div>💨 ${data.wind?.speed} m/s</div>
        <div>🌡️ Feels ${Math.round(data.main?.feels_like)}°</div>
        <div>📊 ${data.main?.pressure} hPa</div>
      </div>
    </div>
  `

  clickMarker.bindPopup(popupContent, {
    maxWidth: 280,
    closeButton: true,
  }).openPopup()
}

onUnmounted(() => {
  map?.remove()
})
</script>
