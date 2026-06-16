<script setup lang="ts">
// MOCK: агрегаты из docs/tracker.json + docs/labor_tracking.xlsx (см. docs/report.md).
// Заменить на GET /api/v1/tracker-report при появлении бэкенда.
import slides from '~/mocks/slides.json'

const { hiContrast, toggleHiContrast } = useHiContrast()
const current = ref(0)
const totalSlides = 7
const contentSlides = 6

const themeColor = computed(() => (current.value === 0 ? '#0000bb' : '#f5f5f5'))

useHead({
  meta: [{ name: 'theme-color', content: themeColor }]
})

function go(i: number) {
  current.value = Math.max(0, Math.min(totalSlides - 1, i))
}
function onKey(e: KeyboardEvent) {
  if (e.key === 'ArrowRight' || e.key === 'PageDown') go(current.value + 1)
  if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(current.value - 1)
}
onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => window.removeEventListener('keydown', onKey))
</script>

<template>
  <div class="deck" :class="{ 'deck--cover': current === 0, 'deck--hc': hiContrast }">
    <div class="deck-stage">
      <SlidesSlideCover v-if="current === 0" />
      <SlidesSlideOverview v-else-if="current === 1" :data="slides" />
      <SlidesSlideDeadlines v-else-if="current === 2" :data="slides" />
      <SlidesSlideWorkload v-else-if="current === 3" :data="slides" />
      <SlidesSlideAiNext v-else-if="current === 4" :data="slides" />
      <SlidesSlideAiNow v-else-if="current === 5" :data="slides" />
      <SlidesSlideAiPlan v-else :data="slides" />
    </div>

    <footer class="deck-footer">
      <button type="button" class="deck-logo" @click="toggleHiContrast">
        <img src="/img/logo.svg" alt="" />
      </button>
      <div v-if="current === 0" class="nav-grp">
        <button class="cover-btn" aria-label="Просмотр" @click="go(1)">
          <span>Просмотр</span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
      <div v-else class="nav-grp">
        <button
          class="nav-btn"
          :disabled="current === 1"
          aria-label="Назад"
          @click="go(current - 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="nav-counter">{{ current }}/{{ contentSlides }}</span>
        <button
          class="nav-btn nav-btn--next"
          :disabled="current === totalSlides - 1"
          aria-label="Вперёд"
          @click="go(current + 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5 10.5 8 6 12.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </footer>
  </div>
</template>
