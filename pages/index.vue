<script setup lang="ts">
// MOCK: агрегаты из docs/tracker.json + docs/labor_tracking.xlsx (см. docs/report.md).
// Заменить на GET /api/v1/tracker-report при появлении бэкенда.
import slides from '~/mocks/slides.json'

const current = ref(0)
const totalSlides = 6

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
  <div class="deck">
    <SlidesSlideOverview v-if="current === 0" :data="slides" />
    <SlidesSlideDeadlines v-else-if="current === 1" :data="slides" />
    <SlidesSlideWorkload v-else-if="current === 2" :data="slides" />
    <SlidesSlideAiNext v-else-if="current === 3" :data="slides" />
    <SlidesSlideAiNow v-else-if="current === 4" :data="slides" />
    <SlidesSlideAiPlan v-else :data="slides" />

    <footer class="deck-footer">
      <img src="/img/logo.svg" alt="logo" />
      <div class="nav-grp">
        <button
          class="nav-btn"
          :disabled="current === 0"
          aria-label="Назад"
          @click="go(current - 1)"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3.5 5.5 8l4.5 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
        <span class="nav-counter">{{ current + 1 }}/{{ totalSlides }}</span>
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
