<script setup lang="ts">
const props = defineProps<{ data: any }>()
const plan = computed(() => props.data.ai.plan)

function stepNum(i: number) {
  return String(i + 1).padStart(2, '0')
}

const ruleColumns = computed(() => {
  const rules = plan.value.rules as { title: string; desc: string }[]
  return [rules.slice(0, 2), rules.slice(2, 4), rules.slice(4, 6)]
})
</script>

<template>
  <section class="slide slide-ap">
    <header class="ap-head">
      <h1 class="ap-title">Нейросети: Эффективность</h1>
    </header>

    <div class="ap-content">
      <div class="ap-intro">
        <h2 class="ap-lead">{{ plan.lead }}</h2>
        <p class="ap-subtitle">{{ plan.subtitle }}</p>
      </div>

      <div class="ap-body">
        <div class="ap-model">
          <article
            v-for="(m, i) in plan.metrics"
            :key="i"
            class="ap-bento-cell ap-bento-cell--model"
          >
            <h3 class="ap-bento-title">{{ m.title }}</h3>
            <div class="ap-metric-body">
              <p class="ap-metric-desc">{{ m.desc }}</p>
              <p class="ap-metric-risk">{{ m.risk }}</p>
            </div>
          </article>
        </div>

        <article class="ap-bento-cell ap-bento-cell--rules">
          <div class="ap-rules-head">
            <h3 class="ap-bento-title ap-bento-title--rules">Правила внедрения</h3>
            <p class="ap-principle">{{ plan.principle }}</p>
          </div>

          <div class="ap-rules-row">
            <div
              v-for="(col, ci) in ruleColumns"
              :key="ci"
              class="ap-rules-col"
            >
              <div v-for="(rule, ri) in col" :key="ri" class="ap-item">
                <span class="ap-item-num">{{ stepNum(ci * 2 + ri) }}</span>
                <div class="ap-item-body">
                  <span class="ap-item-title">{{ rule.title }}</span>
                  <span class="ap-item-desc">{{ rule.desc }}</span>
                </div>
              </div>
            </div>
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
  margin-bottom: 16px;
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

.ap-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 0;
}

.ap-model {
  flex: 1;
  display: flex;
  gap: 16px;
  min-height: 0;
}

.ap-bento-cell {
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  padding: 48px 24px;
  background: var(--ap-card);
  border: 1px solid var(--ap-card-border);
  border-radius: 36px;
  box-shadow: var(--ap-card-shadow);
  overflow: hidden;
}

.ap-bento-cell--model {
  flex: 1;
  gap: 32px;
}

.ap-bento-cell--rules {
  flex: 1;
  gap: 32px;
}

.ap-bento-title--rules {
  flex: 1;
  min-width: 0;
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

.ap-metric-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
  min-height: 0;
}

.ap-metric-desc {
  margin: 0;
  font-weight: 500;
  font-size: 20px;
  line-height: 20px;
  color: var(--ap-text);
}

.ap-metric-risk {
  margin: 0;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
}

.ap-rules-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  flex-shrink: 0;
  width: 100%;
}

.ap-principle {
  margin: 0;
  flex-shrink: 0;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
  white-space: nowrap;
}

.ap-rules-row {
  flex: 1;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 0;
}

.ap-rules-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
  padding: 0 32px;
  position: relative;
}

.ap-rules-col:first-child {
  padding-left: 0;
}

.ap-rules-col:last-child {
  padding-right: 0;
}

.ap-rules-col:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 1px;
  background: var(--ap-divider);
}

.ap-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-width: 0;
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
  white-space: nowrap;
}

.ap-item-desc {
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: var(--ap-muted);
  word-break: break-word;
}
</style>
