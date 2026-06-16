<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { useChartTheme, BAR_R } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const theme = useChartTheme()

const drillVisible = ref(false)
const drillProject = ref<any>(null)

const deadlines = computed(() => props.data.deadlines.after)
const kpi = computed(() => props.data.kpi)

const SEGMENT_DUR = 500
const BAR_STAGGER = 80

const deadlineOption = computed(() => {
  const t = theme.value
  return {
  textStyle: t.textStyle,
  tooltip: {
    ...t.tooltip,
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (p: any[]) => {
      const total = p.reduce((s, i) => s + i.value, 0)
      const ot = p.find((i) => i.seriesName === 'В срок')?.value ?? 0
      const rows = p
        .map((i) => `${i.marker} ${i.seriesName}: ${i.value}`)
        .join('<br/>')
      return `${p[0].axisValue}<br/>${rows}<br/>${t.ttHint(
        `в срок ${Math.round((ot / total) * 100)}% · клик → задачи`
      )}`
    }
  },
  legend: t.legend,
  grid: { left: 8, right: 16, top: 16, bottom: 38, containLabel: true },
  xAxis: {
    type: 'category',
    data: deadlines.value.map((d: any) => d.project),
    ...t.categoryAxis,
    axisLabel: { ...t.categoryAxisLabel, interval: 0 }
  },
  yAxis: { type: 'value', ...t.valueAxis },
  series: [
    {
      name: 'В срок',
      type: 'bar',
      stack: 't',
      data: deadlines.value.map((d: any) => d.onTime),
      itemStyle: { color: t.ok, borderRadius: BAR_R.stackBottom },
      barWidth: '52%',
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => idx * BAR_STAGGER,
      emphasis: { focus: 'series' }
    },
    {
      name: 'Просрочено',
      type: 'bar',
      stack: 't',
      data: deadlines.value.map((d: any) => d.late),
      itemStyle: { color: t.bad, borderRadius: BAR_R.stackTop },
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => SEGMENT_DUR + idx * BAR_STAGGER,
      emphasis: { focus: 'series' }
    }
  ]
}})

const throughputOption = computed(() => {
  const th = theme.value
  return {
  textStyle: th.textStyle,
  tooltip: { ...th.tooltip, trigger: 'axis' },
  grid: { left: 8, right: 18, top: 24, bottom: 28, containLabel: true },
  xAxis: {
    type: 'category',
    data: props.data.throughput.map((m: any) => m.month),
    ...th.categoryAxis
  },
  yAxis: { type: 'value', ...th.valueAxis },
  series: [
    {
      name: 'Закрыто задач',
      type: 'line',
      smooth: true,
      symbol: 'circle',
      symbolSize: 6,
      data: props.data.throughput.map((m: any) => m.count),
      lineStyle: { width: th.brand === '#0000bb' ? 3 : 2, color: th.brand },
      itemStyle: { color: th.brand, borderWidth: 0 },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: th.brand === '#0000bb' ? 'rgba(0,0,187,0.2)' : 'rgba(0,113,227,0.12)' },
            { offset: 1, color: 'rgba(0,113,227,0)' }
          ]
        }
      },
      label: { show: true, position: 'top', color: th.brand, ...th.barLabel }
    }
  ]
}})

function onDeadlineClick(params: any) {
  const proj = deadlines.value[params.dataIndex]
  if (proj && proj.lateTasks.length) {
    drillProject.value = proj
    drillVisible.value = true
  }
}
</script>

<template>
  <section class="slide slide-ov">
    <header class="ov-head">
      <h1 class="ov-title">Сколько сделали и держим ли сроки</h1>
    </header>

    <div class="ov-content">
      <div class="ov-kpis">
        <div class="ov-kpi">
          <div class="ov-kpi-val"><CountUp :value="kpi.onTimePct" :duration="600" :delay="80" />%</div>
          <div class="ov-kpi-lbl">Дедлайнов в срок</div>
        </div>
        <div class="ov-kpi">
          <div class="ov-kpi-val"><CountUp :value="kpi.tasksDone" :duration="600" :delay="140" /></div>
          <div class="ov-kpi-lbl">Задач завершено</div>
        </div>
        <div class="ov-kpi">
          <div class="ov-kpi-val"><CountUp :value="kpi.totalSpent" :duration="600" :delay="200" /></div>
          <div class="ov-kpi-lbl">Часов трудозатрат</div>
        </div>
        <div class="ov-kpi">
          <div class="ov-kpi-val"><CountUp :value="kpi.projects" :duration="600" :delay="260" /></div>
          <div class="ov-kpi-lbl">Активных проектов</div>
        </div>
      </div>

      <div class="ov-dashboard">
        <div class="ov-card">
          <h3 class="ov-card-title">Дедлайны по проектам</h3>
          <EChart :option="deadlineOption" @click="onDeadlineClick" />
        </div>
        <div class="ov-card">
          <h3 class="ov-card-title">Динамика закрытия задач по месяцам</h3>
          <EChart :option="throughputOption" />
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="drillVisible"
      modal
      class="deck-dialog"
      :header="`Просрочки · ${drillProject?.project}`"
      :style="{ width: '560px' }"
    >
      <table class="proof-table proof-table--dialog">
        <thead>
          <tr><th>Задача</th><th>Просрочка</th><th>Название</th></tr>
        </thead>
        <tbody>
          <tr v-for="t in drillProject?.lateTasks" :key="t.key">
            <td>{{ t.key }}</td>
            <td class="tag-bad">+{{ t.days }} дн</td>
            <td class="proof-muted">{{ t.title }}</td>
          </tr>
        </tbody>
      </table>
    </Dialog>
  </section>
</template>

<style scoped>
.slide-ov {
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

.ov-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
  margin: 0;
}
.ov-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #737373;
  margin: 0;
  letter-spacing: 0;
}

.ov-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  width: 100%;
}

.ov-kpis {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  width: 100%;
}
.ov-kpi {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  height: 160px;
  padding: 16px 24px;
  background: var(--ov-card);
  border: 1px solid var(--ov-card-border);
  border-radius: 42px;
  box-shadow: var(--ov-card-shadow);
  overflow: hidden;
}
.ov-kpi-val {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: var(--ov-num);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}
.ov-kpi-lbl {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: #737373;
}

.ov-dashboard {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
  width: 100%;
}
.ov-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 28px 24px;
  background: var(--ov-card);
  border: 1px solid var(--ov-card-border);
  border-radius: 42px;
  box-shadow: var(--ov-card-shadow);
  overflow: hidden;
}
.ov-card-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: var(--ov-text);
  margin: 0 0 16px;
}
.ov-card :deep(.chart) {
  flex: 1;
  min-height: 0;
}
</style>
