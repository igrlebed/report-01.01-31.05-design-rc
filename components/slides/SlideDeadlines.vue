<script setup lang="ts">
import SelectButton from 'primevue/selectbutton'
import { BRAND, OK, BAD, MUTED, baseTooltip, baseTextStyle } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()

const mode = ref<'after' | 'before'>('after')
const modeOptions = [
  { label: 'После корректировок', value: 'after' },
  { label: 'Как в трекере', value: 'before' }
]

const rows = computed(() => props.data.deadlines[mode.value])
const total = computed(() =>
  mode.value === 'after' ? props.data.deadlines.totalAfter : props.data.deadlines.totalBefore
)

function barColor(pct: number) {
  if (pct >= 90) return OK
  if (pct >= 70) return BRAND
  return BAD
}

const option = computed(() => {
  const sorted = [...rows.value].sort((a, b) => a.pct - b.pct)
  return {
    textStyle: baseTextStyle,
    tooltip: {
      ...baseTooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: any[]) => {
        const r = sorted[p[0].dataIndex]
        return `<b>${r.project}</b><br/>в срок <b>${r.pct}%</b><br/><span style="opacity:.7">${r.onTime} в срок · ${r.late} просрочено</span>`
      }
    },
    grid: { left: 8, right: 48, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', max: 100, splitLine: { lineStyle: { color: '#eef0f7' } }, axisLabel: { color: MUTED, formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: sorted.map((r) => r.project),
      axisLabel: { color: MUTED, fontWeight: 600 },
      axisLine: { lineStyle: { color: '#e0e1ee' } }
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((r) => ({ value: r.pct, itemStyle: { color: barColor(r.pct), borderRadius: [0, 8, 8, 0] } })),
        barWidth: '56%',
        label: { show: true, position: 'right', formatter: '{c}%', color: MUTED, fontWeight: 700 }
      }
    ]
  }
})
</script>

<template>
  <section class="slide">
    <div class="slide-head">
      <div>
        <div class="slide-kicker">Слайд 2 / 5</div>
        <h1 class="slide-title">Дедлайны — главный и честный показатель</h1>
      </div>
      <div class="slide-sub">% задач, закрытых в срок</div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <div class="toggle-row">
          <SelectButton v-model="mode" :options="modeOptions" option-label="label" option-value="value" :allow-empty="false" />
          <span class="slide-sub" style="margin-left: auto">
            Итого: <b :style="{ color: total.pct >= 80 ? 'var(--ok)' : 'var(--brand)', fontSize: '20px' }">{{ total.pct }}%</b>
            <span style="color: var(--muted)"> ({{ total.onTime }} / {{ total.onTime + total.late }})</span>
          </span>
        </div>
        <EChart :option="option" />
      </div>

      <div class="card" style="gap: 16px; justify-content: center">
        <div class="callout">
          <b>Переключатель «как в трекере → после корректировок»</b> показывает рост
          {{ data.deadlines.totalBefore.pct }}% → {{ data.deadlines.totalAfter.pct }}%.
          Часть «просрочек» — это переносы сроков по низкоприоритетным задачам бэклога, которые забыли отметить в трекере.
        </div>
        <div class="callout">
          <b>АС МИП ({{ rows.find((r:any)=>r.project==='АС МИП')?.pct }}%)</b> — «хотелки заказчика»:
          переделки и сроки вне контроля команды. Эту метрику оцениваем отдельно, не в общем ряду.
        </div>
        <div class="callout">
          <b>Оценки vs факт не используем как метрику.</b> На закрытии бэклога ЕИМ большой объём
          перекрывали внутри одной задачи (напр. EIMNEW-1727: оценка 86 ч → факт 201 ч) — это особенность учёта,
          а не ошибка планирования.
        </div>
      </div>
    </div>
  </section>
</template>
