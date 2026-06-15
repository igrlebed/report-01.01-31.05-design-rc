<script setup lang="ts">
import Dialog from 'primevue/dialog'
import { BRAND, OK, BAD, MUTED, baseTooltip, baseTextStyle } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()

const drillVisible = ref(false)
const drillProject = ref<any>(null)

const deadlines = computed(() => props.data.deadlines.after)
const kpi = computed(() => props.data.kpi)

const SEGMENT_DUR = 500
const BAR_STAGGER = 80

const deadlineOption = computed(() => ({
  textStyle: baseTextStyle,
  tooltip: {
    ...baseTooltip,
    trigger: 'axis',
    axisPointer: { type: 'shadow' },
    formatter: (p: any[]) => {
      const total = p.reduce((s, i) => s + i.value, 0)
      const ot = p.find((i) => i.seriesName === 'В срок')?.value ?? 0
      const rows = p
        .map((i) => `${i.marker} ${i.seriesName}: <b>${i.value}</b>`)
        .join('<br/>')
      return `<b>${p[0].axisValue}</b><br/>${rows}<br/><span style="opacity:.7">в срок ${Math.round(
        (ot / total) * 100
      )}% · клик → задачи</span>`
    }
  },
  legend: { bottom: 0, icon: 'circle', textStyle: { color: MUTED } },
  grid: { left: 8, right: 16, top: 16, bottom: 38, containLabel: true },
  xAxis: {
    type: 'category',
    data: deadlines.value.map((d: any) => d.project),
    axisLabel: { color: MUTED, fontWeight: 600, interval: 0 },
    axisLine: { lineStyle: { color: '#e0e1ee' } }
  },
  yAxis: {
    type: 'value',
    splitLine: { lineStyle: { color: '#eef0f7' } },
    axisLabel: { color: MUTED }
  },
  series: [
    {
      name: 'В срок',
      type: 'bar',
      stack: 't',
      data: deadlines.value.map((d: any) => d.onTime),
      itemStyle: { color: OK, borderRadius: [0, 0, 6, 6] },
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
      itemStyle: { color: BAD, borderRadius: [6, 6, 0, 0] },
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => SEGMENT_DUR + idx * BAR_STAGGER,
      emphasis: { focus: 'series' }
    }
  ]
}))

const throughputOption = computed(() => ({
  textStyle: baseTextStyle,
  tooltip: { ...baseTooltip, trigger: 'axis' },
  grid: { left: 8, right: 18, top: 24, bottom: 28, containLabel: true },
  xAxis: {
    type: 'category',
    data: props.data.throughput.map((t: any) => t.month),
    axisLabel: { color: MUTED, fontWeight: 600 },
    axisLine: { lineStyle: { color: '#e0e1ee' } }
  },
  yAxis: { type: 'value', splitLine: { lineStyle: { color: '#eef0f7' } }, axisLabel: { color: MUTED } },
  series: [
    {
      name: 'Закрыто задач',
      type: 'line',
      smooth: true,
      symbolSize: 9,
      data: props.data.throughput.map((t: any) => t.count),
      lineStyle: { width: 4, color: BRAND },
      itemStyle: { color: BRAND },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(0,0,187,0.22)' },
            { offset: 1, color: 'rgba(0,0,187,0.01)' }
          ]
        }
      },
      label: { show: true, position: 'top', color: BRAND, fontWeight: 700 }
    }
  ]
}))

function onDeadlineClick(params: any) {
  const proj = deadlines.value[params.dataIndex]
  if (proj && proj.lateTasks.length) {
    drillProject.value = proj
    drillVisible.value = true
  }
}
</script>

<template>
  <section class="slide">
    <div class="slide-head">
      <div>
        <div class="slide-kicker">Слайд 1 / 5</div>
        <h1 class="slide-title">Сколько сделали и держим ли сроки</h1>
      </div>
      <div class="slide-sub">Период: {{ data.period }}</div>
    </div>

    <div class="kpis">
      <div class="kpi">
        <div class="kpi-val">{{ kpi.onTimePct }}%</div>
        <div class="kpi-lbl">дедлайнов в срок</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">{{ kpi.tasksDone }}</div>
        <div class="kpi-lbl">задач завершено</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">{{ kpi.totalSpent.toLocaleString('ru-RU') }}</div>
        <div class="kpi-lbl">часов трудозатрат</div>
      </div>
      <div class="kpi">
        <div class="kpi-val">{{ kpi.projects }}</div>
        <div class="kpi-lbl">активных проектов</div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 class="card-title">Дедлайны по проектам · клик по столбцу → список просрочек</h3>
        <EChart :option="deadlineOption" @click="onDeadlineClick" />
      </div>
      <div class="card">
        <h3 class="card-title">Динамика закрытия задач по месяцам</h3>
        <EChart :option="throughputOption" />
      </div>
    </div>

    <Dialog
      v-model:visible="drillVisible"
      modal
      :header="`Просрочки · ${drillProject?.project}`"
      :style="{ width: '560px' }"
    >
      <table class="proof-table">
        <thead>
          <tr><th>Задача</th><th>Просрочка</th><th>Название</th></tr>
        </thead>
        <tbody>
          <tr v-for="t in drillProject?.lateTasks" :key="t.key">
            <td><b>{{ t.key }}</b></td>
            <td class="tag-bad">+{{ t.days }} дн</td>
            <td style="color: var(--muted)">{{ t.title }}</td>
          </tr>
        </tbody>
      </table>
    </Dialog>
  </section>
</template>
