import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(JSON.parse(localStorage.getItem('climasphere_theme') ?? 'true'))

    function applyTheme() {
        document.documentElement.setAttribute('data-theme', isDark.value ? 'dark' : 'light')
    }

    watch(isDark, (val) => {
        localStorage.setItem('climasphere_theme', JSON.stringify(val))
        applyTheme()
    })

    function toggleTheme() {
        isDark.value = !isDark.value
    }

    // Apply on init
    applyTheme()

    return { isDark, toggleTheme }
})
