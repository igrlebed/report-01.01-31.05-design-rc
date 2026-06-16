<script setup lang="ts">
const props = defineProps<{ data: any }>()
const pipeline = computed(() => props.data.ai.pipeline)

/** Figma: gap между блоком title и tools внутри нижнего frame */
const pipeInnerGap = [24, 120, 216, 312]

function formatPipeTitle(title: string) {
  return title.replace(' / ', ' /<br>')
}
</script>

<template>
  <section class="slide slide-nx">
    <header class="nx-head">
      <h1 class="nx-title">Нейросети: как это работает</h1>
    </header>

    <div class="nx-content">
      <h2 class="nx-lead">ИИ-конвейер частично закрывает всю цепочку</h2>

      <div class="nx-pipe">
        <div
          v-for="(step, i) in pipeline"
          :key="step.step"
          class="nx-pipe-card"
        >
          <span class="nx-pipe-num">{{ String(i + 1).padStart(2, '0') }}</span>
          <div class="nx-pipe-inner" :style="{ gap: `${pipeInnerGap[i]}px` }">
            <div class="nx-pipe-main">
              <div class="nx-pipe-bar" />
              <h3 class="nx-pipe-title" v-html="formatPipeTitle(step.step)" />
            </div>
            <p class="nx-pipe-tools">{{ step.tools }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-nx {
  --nx-text: #404040;
  --nx-muted: #737373;
  --nx-card: #fafafa;
  --nx-card-border: #f2f2f2;
  --nx-bar: rgba(0, 0, 187, 0.2);
  --nx-card-shadow:
    53px 54px 21px 0 rgba(237, 237, 237, 0),
    34px 34px 19px 0 rgba(237, 237, 237, 0.01),
    19px 19px 16px 0 rgba(237, 237, 237, 0.05),
    8px 9px 12px 0 rgba(237, 237, 237, 0.09),
    2px 2px 7px 0 rgba(237, 237, 237, 0.1);

  padding: 24px !important;
  gap: 16px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.nx-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.nx-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: var(--nx-muted);
  margin: 0;
}

.nx-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 0;
  width: 100%;
}

.nx-lead {
  margin: 0;
  padding: 0 24px;
  max-width: 900px;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: #02028a;
}

.nx-pipe {
  flex: 1;
  display: flex;
  align-items: stretch;
  gap: 16px;
  min-height: 0;
  width: 100%;
}

.nx-pipe-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  min-width: 0;
  min-height: 0;
  padding: 24px;
  background: var(--nx-card);
  border: 1px solid var(--nx-card-border);
  border-radius: 36px;
  box-shadow: var(--nx-card-shadow);
  overflow: hidden;
}

.nx-pipe-num {
  flex-shrink: 0;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: var(--nx-muted);
}

.nx-pipe-inner {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  flex-shrink: 0;
}

.nx-pipe-main {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.nx-pipe-bar {
  height: 8px;
  width: 100%;
  background: var(--nx-bar);
  border-radius: 999px;
}

.nx-pipe-title {
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 32px;
  line-height: 36px;
  letter-spacing: -0.64px;
  color: var(--nx-text);
}

.nx-pipe-tools {
  margin: 0;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 14px;
  color: var(--nx-muted);
  white-space: nowrap;
}
</style>
