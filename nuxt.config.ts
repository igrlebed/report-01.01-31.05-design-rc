import { definePreset } from '@primevue/themes'
import Aura from '@primevue/themes/aura'

// Брендовая палитра на основе #0000BB
const BrandPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '#e6e6f7',
      100: '#c2c2ec',
      200: '#9999e0',
      300: '#7070d4',
      400: '#4747c8',
      500: '#0000bb',
      600: '#0000a8',
      700: '#000091',
      800: '#00007a',
      900: '#000063',
      950: '#00004a'
    }
  }
})

export default defineNuxtConfig({
  compatibilityDate: '2025-01-01',
  devtools: { enabled: false },
  modules: ['@primevue/nuxt-module'],
  css: ['primeicons/primeicons.css', '~/assets/css/main.css'],
  app: {
    head: {
      title: 'Отчёт по трекеру — демо для руководства',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }]
    }
  },
  primevue: {
    options: {
      theme: {
        preset: BrandPreset,
        options: { darkModeSelector: '.dark-mode' }
      }
    }
  }
})
