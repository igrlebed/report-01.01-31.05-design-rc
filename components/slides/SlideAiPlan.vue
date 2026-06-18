<script setup lang="ts">
const props = defineProps<{ data: any }>()
const plan = computed(() => props.data.ai.plan)

function stepNum(i: number) {
  return String(i + 1).padStart(2, '0')
}
</script>

<template>
  <section class="slide slide-ap">
    <header class="ap-head">
      <h1 class="ap-title">Нейросети: что планируем делать</h1>
    </header>

    <div class="ap-content">
      <div class="ap-intro">
        <h2 class="ap-lead">{{ plan.lead }}</h2>
        <p class="ap-subtitle">{{ plan.subtitle }}</p>
      </div>

      <div class="ap-bento">
        <div class="ap-bento-top">
          <article class="ap-bento-cell ap-bento-cell--plan">
            <h3 class="ap-bento-title">План</h3>
            <ol class="ap-items">
              <li v-for="(step, i) in plan.steps" :key="i" class="ap-item">
                <span class="ap-item-num">{{ stepNum(i) }}</span>
                <div class="ap-item-body">
                  <span class="ap-item-title">{{ step.title }}</span>
                  <span class="ap-item-desc">{{ step.desc }}</span>
                </div>
              </li>
            </ol>
          </article>

          <article class="ap-bento-cell ap-bento-cell--goal">
            <h3 class="ap-bento-title">Цель</h3>
            <div class="ap-stages">
              <div v-for="(s, i) in plan.designStages" :key="i" class="ap-stage">
                <span class="ap-stage-name">{{ s.stage }}</span>
                <span class="ap-stage-ai">{{ s.ai }}</span>
              </div>
            </div>
          </article>

          <article class="ap-bento-cell ap-bento-cell--rules">
            <h3 class="ap-bento-title">Принципы</h3>
            <ol class="ap-items">
              <li v-for="(rule, i) in plan.rules" :key="i" class="ap-item">
                <span class="ap-item-num">{{ stepNum(i) }}</span>
                <div class="ap-item-body">
                  <span class="ap-item-title">{{ rule.title }}</span>
                  <span class="ap-item-desc">{{ rule.desc }}</span>
                </div>
              </li>
            </ol>
          </article>
        </div>

        <article class="ap-bento-cell ap-bento-cell--metrics">
          <div class="ap-metrics-head">
            <h3 class="ap-bento-title">Как поймём, что работает</h3>
            <p class="ap-principle">{{ plan.principle }}</p>
          </div>
          <div class="ap-metrics">
            <article v-for="(g, i) in plan.metrics" :key="i" class="ap-metric">
              <h4 class="ap-metric-title">{{ g.title }}</h4>
              <ul class="ap-metric-kpis">
                <li v-for="(k, j) in g.kpis" :key="j" class="ap-metric-kpi">
                  <span class="ap-kpi-label">{{ k.label }}</span>
                  <span class="ap-kpi-desc">{{ k.desc }}</span>
                </li>
              </ul>
            </article>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-ap {
  --ap-text: #404040;
  --ap-muted: #737373;
  --ap-num: #02028a;
  --ap-card: #fafafa;
  --ap-card-border: #f2f2f2;
  --ap-divider: #e3e3e3;
  --ap-card-shadow:
    53px 54px 21px 0 rgba(237, 237, 237, 0),
    34px 34px 19px 0 rgba(237, 237, 237, 0.01),
    19px 19px 16px 0 rgba(237, 237, 237, 0.05),
    8px 9px 12px 0 rgba(237, 237, 237, 0.09),
    2px 2px 7px 0 rgba(237, 237, 237, 0.1);

  padding: 24px;
  gap: 16px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.ap-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}

.ap-title {
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

.ap-intro {
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex-shrink: 0;
  padding: 0 24px;
}

.ap-lead {
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: var(--ap-num);
}

.ap-subtitle {
  margin: 0;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-muted);
  max-width: 1136px;
}

.ap-bento {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
  width: 100%;
}

.ap-bento-top {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.ap-bento-cell {
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-height: 0;
  min-width: 0;
  padding: 24px;
  background: var(--ap-card);
  border: 1px solid var(--ap-card-border);
  border-radius: 36px;
  box-shadow: var(--ap-card-shadow);
  overflow: hidden;
}

.ap-bento-cell--metrics {
  flex: 1;
  min-height: 0;
}

.ap-bento-title {
  margin: 0;
  flex-shrink: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 36px;
  line-height: 36px;
  letter-spacing: -0.72px;
  color: var(--ap-num);
}

.ap-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ap-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.ap-item-num {
  flex-shrink: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  letter-spacing: -0.4px;
  color: var(--ap-num);
}

.ap-item-body {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.ap-item-title {
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-text);
}

.ap-item-desc {
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
}

.ap-stages {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 40px 16px;
  align-content: flex-start;
  min-height: 0;
}

.ap-stage {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 194px;
  max-width: 100%;
}

.ap-stage-name {
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-text);
}

.ap-stage-ai {
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
}

.ap-metrics-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-shrink: 0;
}

.ap-principle {
  margin: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
  white-space: nowrap;
}

.ap-metrics {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 64px;
  min-height: 0;
}

.ap-metric {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 32px;
  min-width: 0;
  padding-right: 24px;
  border-right: 1px solid var(--ap-divider);
}

.ap-metric:last-child {
  padding-right: 0;
  border-right: none;
}

.ap-metric-title {
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  letter-spacing: -0.48px;
  color: var(--ap-num);
}

.ap-metric-kpis {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ap-metric-kpi {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.ap-kpi-label {
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-text);
}

.ap-kpi-desc {
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
}
</style>
