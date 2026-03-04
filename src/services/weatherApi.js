import axios from 'axios'

const API_KEY = import.meta.env.VITE_OWM_API_KEY
const BASE = 'https://api.openweathermap.org'

const api = axios.create({
    baseURL: BASE,
    timeout: 10000,
})

// Simple in-memory cache
const cache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function withCache(key, fetcher) {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.ts < CACHE_TTL) return Promise.resolve(cached.data)
    return fetcher().then(data => {
        cache.set(key, { data, ts: Date.now() })
        return data
    })
}

export function getCurrentWeather(city) {
    return withCache(`weather_${city}`, () =>
        api.get('/data/2.5/weather', {
            params: { q: city, appid: API_KEY, units: 'metric' }
        }).then(r => r.data)
    )
}

export function getWeatherByCoords(lat, lon) {
    return withCache(`weather_${lat}_${lon}`, () =>
        api.get('/data/2.5/weather', {
            params: { lat, lon, appid: API_KEY, units: 'metric' }
        }).then(r => r.data)
    )
}

export function getForecast(city) {
    return withCache(`forecast_${city}`, () =>
        api.get('/data/2.5/forecast', {
            params: { q: city, appid: API_KEY, units: 'metric' }
        }).then(r => r.data)
    )
}

export function getForecastByCoords(lat, lon) {
    return withCache(`forecast_${lat}_${lon}`, () =>
        api.get('/data/2.5/forecast', {
            params: { lat, lon, appid: API_KEY, units: 'metric' }
        }).then(r => r.data)
    )
}

export function getAirQuality(lat, lon) {
    return withCache(`aqi_${lat}_${lon}`, () =>
        api.get('/data/2.5/air_pollution', {
            params: { lat, lon, appid: API_KEY }
        }).then(r => r.data)
    )
}

export function getCityAutocomplete(query) {
    if (!query || query.length < 2) return Promise.resolve([])
    return withCache(`geo_${query}`, () =>
        api.get('/geo/1.0/direct', {
            params: { q: query, limit: 5, appid: API_KEY }
        }).then(r => r.data)
    )
}

export function getWeatherIcon(code) {
    return `https://openweathermap.org/img/wn/${code}@2x.png`
}
