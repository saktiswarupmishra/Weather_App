import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
    const cities = ref(JSON.parse(localStorage.getItem('climasphere_favorites') || '[]'))

    watch(cities, (val) => {
        localStorage.setItem('climasphere_favorites', JSON.stringify(val))
    }, { deep: true })

    function addCity(city) {
        if (!cities.value.find(c => c.toLowerCase() === city.toLowerCase())) {
            cities.value.push(city)
        }
    }

    function removeCity(city) {
        cities.value = cities.value.filter(c => c.toLowerCase() !== city.toLowerCase())
    }

    function isFavorite(city) {
        return cities.value.some(c => c.toLowerCase() === city.toLowerCase())
    }

    return { cities, addCity, removeCity, isFavorite }
})
