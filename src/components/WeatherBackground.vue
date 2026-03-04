<template>
  <div class="weather-particles" v-if="type">
    <!-- Rain -->
    <template v-if="type === 'rain'">
      <div v-for="n in 80" :key="'r'+n"
        class="rain-drop"
        :style="{
          left: `${Math.random() * 100}%`,
          height: `${12 + Math.random() * 20}px`,
          animationDuration: `${0.4 + Math.random() * 0.4}s`,
          animationDelay: `${Math.random() * 2}s`,
          opacity: 0.3 + Math.random() * 0.4,
        }">
      </div>
    </template>

    <!-- Snow -->
    <template v-if="type === 'snow'">
      <div v-for="n in 50" :key="'s'+n"
        class="snow-flake"
        :style="{
          left: `${Math.random() * 100}%`,
          width: `${2 + Math.random() * 5}px`,
          height: `${2 + Math.random() * 5}px`,
          animationDuration: `${4 + Math.random() * 6}s`,
          animationDelay: `${Math.random() * 6}s`,
          opacity: 0.3 + Math.random() * 0.5,
          filter: `blur(${Math.random() < 0.3 ? 1 : 0}px)`,
        }">
      </div>
    </template>

    <!-- Lightning -->
    <div v-if="type === 'thunder'" class="lightning-overlay"
      :style="{ animationDelay: `${Math.random() * 3}s` }">
    </div>

    <!-- Mist -->
    <template v-if="type === 'mist'">
      <div v-for="n in 3" :key="'m'+n"
        class="mist-layer"
        :style="{
          top: `${20 + n * 25}%`,
          opacity: 0.3 - n * 0.05,
          animationDuration: `${12 + n * 5}s`,
          animationDelay: `${n * 2}s`,
        }">
      </div>
    </template>
  </div>
</template>

<script setup>
defineProps({
  type: { type: String, default: null },
})
</script>
