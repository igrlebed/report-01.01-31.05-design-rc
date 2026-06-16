<script setup lang="ts">
import { useChartTheme, BAR_R } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const theme = useChartTheme()

const rows = computed(() => props.data.deadlines.after)
const total = computed(() => props.data.deadlines.totalAfter)

function barColor(pct: number, colors: { ok: string; brand: string; bad: string }) {
  if (pct >= 90) return colors.ok
  if (pct >= 70) return colors.brand
  return colors.bad
}

const option = computed(() => {
  const t = theme.value
  const sorted = [...rows.value].sort((a, b) => a.pct - b.pct)
  return {
    textStyle: t.textStyle,
    tooltip: {
      ...t.tooltip,
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (p: any[]) => {
        const r = sorted[p[0].dataIndex]
        return `${r.project}<br/>в срок ${r.pct}%<br/>${t.ttHint(`${r.onTime} в срок · ${r.late} просрочено`)}`
      }
    },
    grid: { left: 8, right: 48, top: 10, bottom: 10, containLabel: true },
    xAxis: { type: 'value', max: 100, ...t.valueAxis, axisLabel: { ...t.valueAxis.axisLabel, formatter: '{value}%' } },
    yAxis: {
      type: 'category',
      data: sorted.map((r) => r.project),
      ...t.categoryAxis
    },
    series: [
      {
        type: 'bar',
        data: sorted.map((r) => ({ value: r.pct, itemStyle: { color: barColor(r.pct, t), borderRadius: BAR_R.horizEnd } })),
        barWidth: '56%',
        label: { show: true, position: 'right', formatter: '{c}%', color: t.chartMuted, ...t.barLabel }
      }
    ]
  }
})

const asmip = computed(() => rows.value.find((r: any) => r.project === 'АС МИП')?.pct)
</script>

<template>
  <section class="slide slide-dl">
    <header class="dl-head">
      <h1 class="dl-title">Дедлайны — главный показатель</h1>
    </header>

    <div class="dl-content">
      <div class="dl-dashboard">
        <div class="dl-card dl-chart-card">
          <div class="dl-headline">
            <p class="dl-headline-lbl">Процент задач, закрытых в срок</p>
            <div class="dl-metric">
              <span class="dl-metric-val">
                <CountUp :value="total.pct" :duration="600" :delay="80" />%
              </span>
              <span class="dl-metric-sub">
                (<CountUp :value="total.onTime" :duration="600" :delay="120" />
                /
                <CountUp :value="total.onTime + total.late" :duration="600" :delay="160" />)
              </span>
            </div>
          </div>
          <EChart :option="option" />
        </div>

        <div class="dl-notes">
          <div class="dl-card dl-note">
            <h3 class="dl-note-title">Откуда просрочки?</h3>
            <p class="dl-note-text">
              Часть «просрочек» — это переносы сроков по низкоприоритетным задачам бэклога, у которых не было переноса дедлайна в трекере.
            </p>
          </div>
          <div class="dl-card dl-note">
            <h3 class="dl-note-title">АС МИП ({{ asmip }}%)</h3>
            <p class="dl-note-text">
              «Хотелки заказчика»: переделки и сроки вне контроля команды. Эту метрику оцениваем отдельно, не в общем ряду.
            </p>
          </div>
          <div class="dl-card dl-note">
            <h3 class="dl-note-title">Оценки vs факт не используем как метрику</h3>
            <p class="dl-note-text">
              На закрытии бэклога ЕИМ большой объём перекрывали внутри одной задачи (напр. EIMNEW-1727: оценка 86 ч → факт 201 ч) — это особенность учёта, а не ошибка планирования.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-dl {
  --ov-text: #404040;
  --ov-num: #02028a;
  --ov-card: #fafafa;
  --ov-card-border: #f2f2f2;
  --ov-card-shadow:
    53px 54px 21px 0 rgba(237, 237, 237, 0),
    34px 34px 19px 0 rgba(237, 237, 237, 0.01),
    19px 19px 16px 0 rgba(237, 237, 237, 0.05),
    8px 9px 12px 0 rgba(237, 237, 237, 0.09),
    2px 2px 7px 0 rgba(237, 237, 237, 0.1);

  padding: 24px;
  gap: 16px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.dl-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.dl-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}

.dl-content {
  flex: 1;
  display: flex;
  min-height: 0;
  width: 100%;
}
.dl-dashboard {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
  width: 100%;
}

.dl-card {
  background: var(--ov-card);
  border: 1px solid var(--ov-card-border);
  border-radius: 42px;
  box-shadow: var(--ov-card-shadow);
  overflow: hidden;
}

.dl-chart-card {
  flex: 1.25;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 28px 24px;
}
.dl-headline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 8px;
}
.dl-headline-lbl {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: var(--ov-text);
  margin: 0;
}
.dl-metric {
  display: flex;
  align-items: flex-end;
  gap: 8px;
}
.dl-metric-val {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 28px;
  line-height: 28px;
  letter-spacing: -0.4px;
  color: var(--ov-num);
  font-variant-numeric: tabular-nums;
}
.dl-metric-sub {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;
  color: #a3a3a3;
}
.dl-chart-card :deep(.chart) {
  flex: 1;
  min-height: 0;
}

.dl-notes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  min-width: 0;
}
.dl-note {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  min-height: 0;
  padding: 28px 24px;
  border-radius: 42px;
}
.dl-note-title {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  color: #02028A;
  margin: 0;
}
.dl-note-text {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}
</style>
