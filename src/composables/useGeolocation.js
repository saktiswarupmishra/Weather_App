import { ref } from 'vue'

export function useGeolocation() {
    const coords = ref(null)
    const error = ref(null)
    const loading = ref(false)

    function detect() {
        if (!navigator.geolocation) {
            error.value = 'Geolocation not supported'
            return Promise.reject(error.value)
        }
        loading.value = true
        error.value = null
        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    coords.value = { lat: pos.coords.latitude, lon: pos.coords.longitude }
                    loading.value = false
                    resolve(coords.value)
                },
                (err) => {
                    error.value = err.message
                    loading.value = false
                    reject(err)
                },
                { enableHighAccuracy: true, timeout: 10000 }
            )
        })
    }

    return { coords, error, loading, detect }
}
