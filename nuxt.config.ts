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
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0000bb' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700&family=Tektur:wght@400;500;600;700&display=swap'
        }
      ]
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
