<script setup lang="ts">
// MOCK: агрегаты из docs/tracker.json + docs/labor_tracking.xlsx (см. docs/report.md).
// Заменить на GET /api/v1/tracker-report при появлении бэкенда.
import slides from '~/mocks/slides.json'

const current = ref(0)
const totalSlides = 5

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
    <SlidesSlideAiNow v-else-if="current === 3" :data="slides" />
    <SlidesSlideAiNext v-else :data="slides" />

    <footer class="deck-footer">
      <img src="/img/logo.svg" alt="logo" />
      <div class="dots">
        <span
          v-for="i in totalSlides"
          :key="i"
          class="dot"
          :class="{ active: current === i - 1 }"
          @click="go(i - 1)"
        />
      </div>
      <div class="nav-hint">← / → для навигации</div>
    </footer>
  </div>
</template>
