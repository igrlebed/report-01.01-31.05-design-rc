<script setup lang="ts">
import { useChartTheme, BAR_R } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const theme = useChartTheme()
const ai = computed(() => props.data.ai)

const unit = ref<'hours' | 'ratio'>('hours')

const cases = computed(() => [...ai.value.timeSaved])

const option = computed(() => {
  const t = theme.value
  const c = cases.value
  if (unit.value === 'ratio') {
    return {
      textStyle: t.textStyle,
      tooltip: {
        ...t.tooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (p: any[]) => `${p[0].axisValue}<br/>ускорение ×${p[0].value}`
      },
      grid: { left: 8, right: 56, top: 10, bottom: 10, containLabel: true },
      xAxis: { type: 'value', ...t.valueAxis, axisLabel: { ...t.valueAxis.axisLabel, formatter: '×{value}' } },
      yAxis: {
        type: 'category',
        data: c.map((x) => x.case),
        ...t.categoryAxis
      },
      series: [
        {
          type: 'bar',
          data: c.map((x) => x.ratio),
          itemStyle: { color: t.brand, borderRadius: BAR_R.horizEnd },
          barWidth: '52%',
          label: { show: true, position: 'right', formatter: '×{c}', color: t.brand, ...t.barLabel }
        }
      ]
    }
  }
  return {
    textStyle: t.textStyle,
    tooltip: {
      ...t.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: any[]) =>
        `${p[0].axisValue}<br/>${p
          .map((i) => `${i.marker} ${i.seriesName}: ${i.value} ч`)
          .join('<br/>')}`
    },
    legend: t.legend,
    grid: { left: 8, right: 40, top: 12, bottom: 38, containLabel: true },
    xAxis: { type: 'value', ...t.valueAxis, axisLabel: { ...t.valueAxis.axisLabel, formatter: '{value} ч' } },
    yAxis: {
      type: 'category',
      data: c.map((x) => x.case),
      ...t.categoryAxis,
      axisLabel: { ...t.categoryAxisLabel, width: 150, overflow: 'break' }
    },
    series: [
      {
        name: 'Традиционно',
        type: 'bar',
        data: c.map((x) => x.traditional),
        itemStyle: { color: t.neutral, borderRadius: BAR_R.horizGrouped },
        barGap: '10%'
      },
      {
        name: 'С ИИ',
        type: 'bar',
        data: c.map((x) => x.ai),
        itemStyle: { color: t.brand, borderRadius: BAR_R.horizGrouped }
      }
    ]
  }
})
</script>

<template>
  <section class="slide slide-ai">
    <header class="ai-head">
      <h1 class="ai-title">Нейросети: что уже сделали</h1>
    </header>

    <div class="ai-content">
      <div class="ai-kpis">
        <div v-for="(k, i) in ai.kpi" :key="k.label" class="ai-kpi">
          <div class="ai-kpi-val"><CountUp :value="k.value" :delay="180 + i * 100" /></div>
          <div class="ai-kpi-lbl">{{ k.label }}</div>
        </div>
      </div>

      <div class="ai-dashboard">
        <div class="ai-projects">
          <div v-for="p in ai.projects" :key="p.project" class="ai-card">
            <div class="ai-card-headline">
              <span class="ai-card-proj">{{ p.project }}</span>
            </div>
            <p class="ai-card-did">{{ p.did }}</p>
            <div class="ai-card-badges">
              <span v-for="(badge, i) in p.effects ?? [p.effect]" :key="i" class="ai-card-effect">{{ badge }}</span>
            </div>
          </div>
        </div>

        <div class="ai-chart-card">
          <div class="ai-chart-headline">
            <p class="ai-chart-lbl">Время: традиционно vs с ИИ</p>
            <div class="ai-tabs">
              <button
                class="ai-tab"
                :class="{ 'ai-tab--active': unit === 'hours' }"
                @click="unit = 'hours'"
              >
                В часах
              </button>
              <button
                class="ai-tab"
                :class="{ 'ai-tab--active': unit === 'ratio' }"
                @click="unit = 'ratio'"
              >
                В разах
              </button>
            </div>
          </div>
          <EChart :option="option" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-ai {
  --ai-text: #404040;
  --ai-num: #02028a;
  --ai-muted: #737373;
  --ai-card: #fafafa;
  --ai-card-border: #f2f2f2;
  --ai-card-shadow:
    53px 54px 21px 0 rgba(237, 237, 237, 0),
    34px 34px 19px 0 rgba(237, 237, 237, 0.01),
    19px 19px 16px 0 rgba(237, 237, 237, 0.05),
    8px 9px 12px 0 rgba(237, 237, 237, 0.09),
    2px 2px 7px 0 rgba(237, 237, 237, 0.1);

  padding: 24px;
  gap: 16px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.ai-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.ai-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}

.ai-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  width: 100%;
}

.ai-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
}
.ai-kpi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  height: 160px;
  padding: 16px 24px;
  background: var(--ai-card);
  border: 1px solid var(--ai-card-border);
  border-radius: 42px;
  box-shadow: var(--ai-card-shadow);
  overflow: hidden;
}
.ai-kpi-val {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: var(--ai-num);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ai-kpi-lbl {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #737373;
}

.ai-dashboard {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
  width: 100%;
}

.ai-projects {
  flex: 0 0 608px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 0;
}
.slide-ai .ai-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 16px;
  min-height: 0;
  padding-block: 28px;
  padding-inline: 24px;
  background: var(--ai-card);
  border: 1px solid var(--ai-card-border);
  border-radius: 40px;
  box-shadow: var(--ai-card-shadow);
  overflow: hidden;
}
.ai-card-headline {
  width: 100%;
}
.ai-card-proj {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 24px;
  color: #02028A;
}
.ai-card-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
  justify-content: flex-start;
  align-self: stretch;
  margin-top: auto;
  margin-left: 0;
}
.ai-card-effect {
  margin-left: 0;
  text-align: left;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #737373;
  background: #f5f5f5;
  border: 1px solid #ededed;
  border-radius: 999px;
  padding: 4px 10px;
}
.ai-card-did {
  flex: 1;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: var(--ai-muted);
  margin: 0;
}

.ai-chart-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 28px 24px;
  background: var(--ai-card);
  border: 1px solid var(--ai-card-border);
  border-radius: 42px;
  box-shadow: var(--ai-card-shadow);
  overflow: hidden;
}
.ai-chart-headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}
.ai-chart-lbl {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: var(--ai-text);
  margin: 0;
}
.ai-tabs {
  display: flex;
  gap: 4px;
  padding: 2px;
  background: #f5f5f5;
  border-radius: 18px;
}
.ai-tab {
  padding: 4px 12px;
  border: none;
  border-radius: 16px;
  background: transparent;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 14px;
  line-height: 16px;
  color: var(--ai-text);
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;
}
.ai-tab--active {
  background: var(--ai-card);
  color: #0000bb;
}
.ai-chart-card :deep(.chart) {
  flex: 1;
  min-height: 0;
}
</style>
