import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getCurrentWeather, getForecast, getAirQuality, getWeatherByCoords } from '../services/weatherApi'

export const useWeatherStore = defineStore('weather', () => {
    const currentWeather = ref(null)
    const forecast = ref(null)
    const airQuality = ref(null)
    const loading = ref(false)
    const error = ref(null)
    const currentCity = ref('')
    const recentSearches = ref([])

    const weatherCondition = computed(() => {
        if (!currentWeather.value) return 'clear'
        const id = currentWeather.value.weather?.[0]?.id
        if (id >= 200 && id < 300) return 'thunderstorm'
        if (id >= 300 && id < 600) return 'rain'
        if (id >= 600 && id < 700) return 'snow'
        if (id >= 700 && id < 800) return 'mist'
        if (id === 800) return 'clear'
        if (id > 800) return 'clouds'
        return 'clear'
    })

    const isNight = computed(() => {
        if (!currentWeather.value) return false
        const now = currentWeather.value.dt
        const sunrise = currentWeather.value.sys?.sunrise
        const sunset = currentWeather.value.sys?.sunset
        return now < sunrise || now > sunset
    })

    async function fetchWeather(city) {
        loading.value = true
        error.value = null
        try {
            const data = await getCurrentWeather(city)
            currentWeather.value = data
            currentCity.value = data.name
            addRecentSearch(data.name)
            // Fetch AQI too
            if (data.coord) {
                try {
                    const aqiData = await getAirQuality(data.coord.lat, data.coord.lon)
                    airQuality.value = aqiData
                } catch { /* AQI is optional */ }
            }
        } catch (e) {
            error.value = e.response?.data?.message || 'City not found'
            currentWeather.value = null
        } finally {
            loading.value = false
        }
    }

    async function fetchForecast(city) {
        try {
            const data = await getForecast(city)
            forecast.value = data
        } catch (e) {
            console.error('Forecast error:', e)
        }
    }

    async function fetchByCoords(lat, lon) {
        loading.value = true
        error.value = null
        try {
            const data = await getWeatherByCoords(lat, lon)
            currentWeather.value = data
            currentCity.value = data.name
            addRecentSearch(data.name)
            if (data.coord) {
                try {
                    const aqiData = await getAirQuality(data.coord.lat, data.coord.lon)
                    airQuality.value = aqiData
                } catch { /* AQI optional */ }
            }
        } catch (e) {
            error.value = e.response?.data?.message || 'Location not found'
        } finally {
            loading.value = false
        }
    }

    function addRecentSearch(city) {
        const idx = recentSearches.value.indexOf(city)
        if (idx !== -1) recentSearches.value.splice(idx, 1)
        recentSearches.value.unshift(city)
        if (recentSearches.value.length > 5) recentSearches.value.pop()
    }

    function clearError() {
        error.value = null
    }

    return {
        currentWeather, forecast, airQuality, loading, error,
        currentCity, recentSearches, weatherCondition, isNight,
        fetchWeather, fetchForecast, fetchByCoords, clearError,
    }
})
