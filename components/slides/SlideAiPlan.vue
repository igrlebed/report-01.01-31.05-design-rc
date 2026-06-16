<script setup lang="ts">
const props = defineProps<{ data: any }>()
const steps = computed(() => props.data.ai.roadmap as string[])
</script>

<template>
  <section class="slide slide-ap">
    <div class="ap-pixels" aria-hidden="true">
      <img src="/img/slide6-pixels.svg" alt="" class="ap-pixels-img" />
    </div>

    <div class="ap-main">
      <header class="ap-head">
        <h1 class="ap-title">Нейросети: что планируем делать</h1>
      </header>

      <div class="ap-content">
        <h2 class="ap-lead">Масштабирование</h2>

        <div class="ap-body">
          <div class="ap-map">
            <template v-for="(step, i) in steps" :key="i">
              <div class="ap-step-row">
                <div class="ap-step-badge">Шаг {{ i + 1 }}</div>
                <p class="ap-step-text">{{ step }}</p>
              </div>
              <div v-if="i < steps.length - 1" class="ap-step-line" aria-hidden="true" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-ap {
  --ap-muted: #737373;
  --ap-num: #02028a;
  --ap-card: #fafafa;
  --ap-card-border: rgba(2, 2, 138, 0.2);
  --ap-card-shadow:
    210px 264px 95px 0 rgba(212, 212, 212, 0),
    135px 169px 86px 0 rgba(212, 212, 212, 0.01),
    76px 95px 73px 0 rgba(212, 212, 212, 0.05),
    34px 42px 54px 0 rgba(212, 212, 212, 0.09),
    8px 11px 30px 0 rgba(212, 212, 212, 0.1);

  position: relative;
  overflow: hidden;
  padding: 0;
  gap: 0;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.ap-pixels {
  position: absolute;
  top: calc(50% + 0.5px);
  right: -15%;
  z-index: 0;
  /* Figma: 1041×979 on 1440×810 frame — wider and taller than viewport */
  height: calc(100% * 979 / 810);
  aspect-ratio: 1041 / 979;
  transform: translateY(-50%);
  pointer-events: none;
}

.ap-pixels-img {
  display: block;
  width: 100%;
  height: 100%;
}

.ap-main {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  max-width: 52%;
  padding: 24px;
}

.ap-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.ap-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-muted);
  margin: 0;
}

.ap-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 0;
  width: 100%;
}

.ap-lead {
  margin: 0;
  padding: 0 24px;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: var(--ap-num);
}

.ap-body {
  flex: 1;
  min-height: 0;
}

.ap-map {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  padding: 0 24px;
}

.ap-step-row {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 460px;
  width: 100%;
}

.ap-step-badge {
  flex-shrink: 0;
  padding: 12px;
  border-radius: 20px;
  background: var(--ap-card);
  border: 1px solid var(--ap-card-border);
  box-shadow: var(--ap-card-shadow);
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  color: var(--ap-num);
  white-space: nowrap;
}

.ap-step-text {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 24px;
  color: var(--ap-muted);
}

.ap-step-line {
  display: flex;
  justify-content: center;
  width: 95px;
  height: 56px;
}
.ap-step-line::before {
  content: '';
  width: 1px;
  height: 100%;
  background: rgba(2, 2, 138, 0.2);
}
</style>
