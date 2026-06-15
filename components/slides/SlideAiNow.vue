<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'
import { BRAND, MUTED, INK, baseTooltip, baseTextStyle } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const ai = computed(() => props.data.ai)

const unit = ref<'hours' | 'ratio'>('hours')
const unitOptions = [
  { label: 'В часах', value: 'hours' },
  { label: 'В разах', value: 'ratio' }
]

const cases = computed(() => [...ai.value.timeSaved])

const option = computed(() => {
  const c = cases.value
  if (unit.value === 'ratio') {
    return {
      textStyle: baseTextStyle,
      tooltip: {
        ...baseTooltip,
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (p: any[]) => `<b>${p[0].axisValue}</b><br/>ускорение <b>×${p[0].value}</b>`
      },
      grid: { left: 8, right: 56, top: 10, bottom: 10, containLabel: true },
      xAxis: { type: 'value', splitLine: { lineStyle: { color: '#eef0f7' } }, axisLabel: { color: MUTED, formatter: '×{value}' } },
      yAxis: {
        type: 'category',
        data: c.map((x) => x.case),
        axisLabel: { color: INK, fontWeight: 600 },
        axisLine: { lineStyle: { color: '#e0e1ee' } }
      },
      series: [
        {
          type: 'bar',
          data: c.map((x) => x.ratio),
          itemStyle: { color: BRAND, borderRadius: [0, 8, 8, 0] },
          barWidth: '52%',
          label: { show: true, position: 'right', formatter: '×{c}', color: BRAND, fontWeight: 800, fontSize: 15 }
        }
      ]
    }
  }
  return {
    textStyle: baseTextStyle,
    tooltip: {
      ...baseTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: any[]) =>
        `<b>${p[0].axisValue}</b><br/>${p
          .map((i) => `${i.marker} ${i.seriesName}: <b>${i.value} ч</b>`)
          .join('<br/>')}`
    },
    legend: { bottom: 0, icon: 'circle', textStyle: { color: MUTED } },
    grid: { left: 8, right: 40, top: 12, bottom: 38, containLabel: true },
    xAxis: { type: 'value', splitLine: { lineStyle: { color: '#eef0f7' } }, axisLabel: { color: MUTED, formatter: '{value} ч' } },
    yAxis: {
      type: 'category',
      data: c.map((x) => x.case),
      axisLabel: { color: INK, fontWeight: 600, width: 150, overflow: 'break' },
      axisLine: { lineStyle: { color: '#e0e1ee' } }
    },
    series: [
      {
        name: 'Традиционно',
        type: 'bar',
        data: c.map((x) => x.traditional),
        itemStyle: { color: '#c9cbe0', borderRadius: [0, 5, 5, 0] },
        barGap: '10%'
      },
      {
        name: 'С ИИ',
        type: 'bar',
        data: c.map((x) => x.ai),
        itemStyle: { color: BRAND, borderRadius: [0, 5, 5, 0] }
      }
    ]
  }
})
</script>

<template>
  <section class="slide">
    <div class="slide-head">
      <div>
        <div class="slide-kicker">Слайд 4 / 5</div>
        <h1 class="slide-title">Нейросети: что уже делаем</h1>
      </div>
      <div class="slide-sub">Опыт и эффект · {{ data.period }}</div>
    </div>

    <div class="kpis">
      <div v-for="k in ai.kpi" :key="k.label" class="kpi">
        <div class="kpi-val">{{ k.value }}</div>
        <div class="kpi-lbl">{{ k.label }}</div>
      </div>
    </div>

    <div class="grid grid-2e">
      <div class="card" style="gap: 12px; overflow: auto">
        <h3 class="card-title">Где и как применяли ИИ</h3>
        <div class="ai-cards">
          <div v-for="p in ai.projects" :key="p.project" class="ai-card">
            <div class="ai-card-head">
              <i class="pi" :class="p.icon" />
              <span class="ai-card-proj">{{ p.project }}</span>
              <span class="ai-card-effect">{{ p.effect }}</span>
            </div>
            <p class="ai-card-did">{{ p.did }}</p>
            <div class="ai-tools">
              <span v-for="t in p.tools" :key="t" class="ai-tool">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="toggle-row">
          <h3 class="card-title" style="margin: 0">Время: традиционно vs с ИИ</h3>
          <span style="margin-left: auto">
            <SelectButton v-model="unit" :options="unitOptions" option-label="label" option-value="value" :allow-empty="false" />
          </span>
        </div>
        <EChart :option="option" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.ai-cards { display: flex; flex-direction: column; gap: 12px; }
.ai-card {
  border: 1px solid #e7e8f2;
  border-radius: 14px;
  padding: 12px 14px;
  transition: 0.18s;
}
.ai-card:hover { border-color: var(--brand); box-shadow: 0 6px 18px rgba(0, 0, 120, 0.08); transform: translateY(-2px); }
.ai-card-head { display: flex; align-items: center; gap: 10px; }
.ai-card-head .pi { color: var(--brand); font-size: 18px; }
.ai-card-proj { font-weight: 800; font-size: 16px; }
.ai-card-effect { margin-left: auto; color: var(--brand); font-weight: 700; font-size: 13px; text-align: right; }
.ai-card-did { margin: 8px 0; color: var(--muted); font-size: 13px; line-height: 1.45; }
.ai-tools { display: flex; flex-wrap: wrap; gap: 6px; }
.ai-tool { background: var(--brand-soft); color: var(--brand); font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; }
</style>
