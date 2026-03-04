# 🌍 ClimaSphere — Weather Intelligence

A modern, real-time weather intelligence web application built with **Vue 3**, **Vite**, and **Tailwind CSS**. ClimaSphere provides global weather data, interactive maps, 5-day forecasts, air quality tracking, and beautiful data visualizations.

![Vue.js](https://img.shields.io/badge/Vue.js-3.x-4FC08D?logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)

---

## ✨ Features

- **Real-Time Weather** — Current conditions with temperature, humidity, wind, and more
- **5-Day Forecast** — Detailed daily and hourly forecast views
- **Interactive Maps** — Explore weather patterns globally with Leaflet.js
- **Air Quality Index** — Track AQI and pollutant levels
- **Sunrise & Sunset** — Visual sun cycle information
- **Hourly Charts** — Temperature and weather trend charts powered by Chart.js
- **Favorites** — Save and manage your favorite cities
- **Weather Alerts** — Stay informed about severe weather conditions
- **Dark / Light Mode** — Seamless theme switching
- **Responsive Design** — Optimized for desktop, tablet, and mobile

---

## 🛠️ Tech Stack

| Layer        | Technology                          |
| ------------ | ----------------------------------- |
| Framework    | Vue 3 (Composition API)             |
| Build Tool   | Vite 7                              |
| Styling      | Tailwind CSS 4                      |
| Language     | TypeScript 5                        |
| State Mgmt   | Pinia                               |
| Routing      | Vue Router 4                        |
| HTTP Client  | Axios                               |
| Maps         | Leaflet.js                          |
| Charts       | Chart.js + vue-chartjs              |
| Animations   | vue3-lottie                         |
| Utilities    | VueUse                              |
| i18n         | vue-i18n                            |

---

## 📁 Project Structure

```
weather-website/
├── public/                  # Static assets
├── src/
│   ├── assets/              # Images, icons, and static resources
│   ├── components/          # Reusable Vue components
│   │   ├── AirQualityCard.vue
│   │   ├── AppNavbar.vue
│   │   ├── ForecastCard.vue
│   │   ├── HourlyChart.vue
│   │   ├── LoadingSkeleton.vue
│   │   ├── SearchBar.vue
│   │   ├── SunriseSunset.vue
│   │   ├── ThemeToggle.vue
│   │   ├── WeatherBackground.vue
│   │   ├── WeatherCard.vue
│   │   └── WeatherMap.vue
│   ├── composables/         # Vue composable functions
│   ├── plugins/             # Vue plugins
│   ├── router/              # Vue Router configuration
│   ├── services/            # API service layer
│   ├── store/               # Pinia stores
│   ├── utils/               # Utility functions
│   ├── views/               # Page-level components
│   │   ├── AlertsView.vue
│   │   ├── DashboardView.vue
│   │   ├── FavoritesView.vue
│   │   ├── ForecastView.vue
│   │   └── MapView.vue
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── index.html               # HTML entry point
├── package.json
├── tsconfig.json
├── vite.config.js
└── .env.example             # Environment variable template
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/weather-website.git
   cd weather-website
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Copy the example env file and add your [OpenWeatherMap API key](https://openweathermap.org/api):

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and replace with your key:

   ```
   VITE_OWM_API_KEY=your_api_key_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open in browser** — visit the URL shown in your terminal (default: `http://localhost:5173`)

### Build for Production

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

## 📸 Pages

| Page          | Description                                      |
| ------------- | ------------------------------------------------ |
| **Dashboard** | Main weather overview with current conditions     |
| **Forecast**  | Detailed 5-day / hourly forecast                  |
| **Map**       | Interactive weather map with overlays              |
| **Favorites** | Saved cities for quick weather access              |
| **Alerts**    | Severe weather alerts and notifications            |

---

## 🔑 API

This project uses the [OpenWeatherMap API](https://openweathermap.org/api) for weather data. You need a free API key to run the application.

1. Sign up at [openweathermap.org](https://openweathermap.org/)
2. Generate an API key from your account dashboard
3. Add it to your `.env` file as `VITE_OWM_API_KEY`

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## © Copyright

© 2026 ClimaSphere. All rights reserved.
