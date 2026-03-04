import { computed } from 'vue'

const gradients = {
    clear: {
        day: 'linear-gradient(135deg, #0369a1 0%, #0284c7 25%, #0ea5e9 55%, #38bdf8 80%, #7dd3fc 100%)',
        night: 'linear-gradient(135deg, #020617 0%, #0a1929 25%, #0f2438 55%, #1a3350 80%, #0f172a 100%)',
    },
    clouds: {
        day: 'linear-gradient(135deg, #334155 0%, #475569 25%, #64748b 55%, #94a3b8 80%, #cbd5e1 100%)',
        night: 'linear-gradient(135deg, #020617 0%, #0f172a 25%, #1e293b 55%, #334155 80%, #1e293b 100%)',
    },
    rain: {
        day: 'linear-gradient(135deg, #1e293b 0%, #334155 25%, #475569 55%, #64748b 80%, #94a3b8 100%)',
        night: 'linear-gradient(135deg, #020617 0%, #0a1929 25%, #1e293b 55%, #334155 80%, #1e293b 100%)',
    },
    thunderstorm: {
        day: 'linear-gradient(135deg, #0c0a1d 0%, #1e1b4b 25%, #312e81 55%, #4338ca 80%, #4f46e5 100%)',
        night: 'linear-gradient(135deg, #020617 0%, #0c0a1d 25%, #1e1b4b 55%, #312e81 80%, #1e1b4b 100%)',
    },
    snow: {
        day: 'linear-gradient(135deg, #94a3b8 0%, #cbd5e1 25%, #e2e8f0 55%, #f1f5f9 80%, #f8fafc 100%)',
        night: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 55%, #475569 80%, #334155 100%)',
    },
    mist: {
        day: 'linear-gradient(135deg, #64748b 0%, #94a3b8 25%, #cbd5e1 55%, #e2e8f0 80%, #f1f5f9 100%)',
        night: 'linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #334155 55%, #475569 80%, #334155 100%)',
    },
}

export function useWeatherBackground(weatherCondition, isNight) {
    const backgroundGradient = computed(() => {
        const condition = weatherCondition.value || 'clear'
        const time = isNight.value ? 'night' : 'day'
        return gradients[condition]?.[time] || gradients.clear[time]
    })

    const particleType = computed(() => {
        const condition = weatherCondition.value || 'clear'
        if (condition === 'thunderstorm') return 'thunder'
        if (condition === 'rain') return 'rain'
        if (condition === 'snow') return 'snow'
        if (condition === 'mist') return 'mist'
        return null
    })

    return { backgroundGradient, particleType }
}
