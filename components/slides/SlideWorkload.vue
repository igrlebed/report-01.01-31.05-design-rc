<script setup lang="ts">
import { useChartTheme, BAR_R } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const theme = useChartTheme()

const workload = computed(() => [...props.data.workload].sort((a, b) => a.total - b.total))

const SEGMENT_DUR = 500
const ROW_STAGGER = 80

const option = computed(() => {
  const t = theme.value
  return {
  textStyle: t.textStyle,
  tooltip: {
    ...t.tooltip,
    trigger: 'item',
    formatter: (p: any) => {
      const w = workload.value[p.dataIndex]
      const parts = w.byProject
        .map((b: any) => `${b.project}: ${b.hours} ч`)
        .join('<br/>')
      return `${w.full} — всего ${w.total} ч<br/>${t.ttHint(`${p.seriesName}: ${p.value} ч`)}${t.ttDivider()}${parts}`
    }
  },
  legend: t.legend,
  grid: { left: 8, right: 40, top: 12, bottom: 38, containLabel: true },
  xAxis: { type: 'value', ...t.valueAxis, axisLabel: { ...t.valueAxis.axisLabel, formatter: '{value} ч' } },
  yAxis: {
    type: 'category',
    data: workload.value.map((w) => w.name),
    ...t.categoryAxis
  },
  series: [
    {
      name: 'Янв–фев (трекер)',
      type: 'bar',
      stack: 'h',
      data: workload.value.map((w) => w.janFeb),
      itemStyle: { color: t.brandSoft, borderRadius: BAR_R.horizStackStart },
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => idx * ROW_STAGGER,
      emphasis: { focus: 'series' }
    },
    {
      name: 'Март–май (таблица)',
      type: 'bar',
      stack: 'h',
      data: workload.value.map((w) => w.marMay),
      itemStyle: { color: t.brand, borderRadius: BAR_R.horizStackEnd },
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => SEGMENT_DUR + idx * ROW_STAGGER,
      label: {
        show: true,
        position: 'right',
        formatter: (p: any) => `${workload.value[p.dataIndex].total} ч`,
        color: t.chartMuted,
        ...t.barLabel
      },
      emphasis: { focus: 'series' }
    }
  ]
}})
</script>

<template>
  <section class="slide slide-wl">
    <header class="wl-head">
      <h1 class="wl-title">Нагрузка команды</h1>
    </header>

    <div class="wl-content">
      <div class="wl-dashboard">
        <div class="wl-card wl-chart-card">
          <p class="wl-chart-lbl">Нагрузка по людям за период {{ data.period }}</p>
          <EChart :option="option" />
        </div>

        <div class="wl-notes">
          <div class="wl-card wl-note">
            <h3 class="wl-note-title">Почему нагрузку считаем по таблице, а не по трекеру</h3>
            <p class="wl-note-text">
              Поле «Затрачено времени» в выгрузке суммирует списания всех участников задачи на одного исполнителя — по выгрузке нельзя понять, кто сколько сделал.
            </p>
          </div>

          <div class="wl-card wl-note wl-note--start">
            <h3 class="wl-note-title">Доказательство: сумма по людям = «Затрачено» в трекере</h3>
            <table class="proof-table">
              <thead>
                <tr><th>Задача</th><th>Списания по людям</th><th>Трекер</th></tr>
              </thead>
              <tbody>
                <tr v-for="row in data.proof" :key="row.key">
                  <td>{{ row.key }}</td>
                  <td class="proof-eq">{{ row.parts.map((p:any[]) => p[1]).join(' + ') }} = <span class="proof-sum">{{ row.tracker }}</span></td>
                  <td class="tag-ok">{{ row.tracker }} ч</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="wl-card wl-note">
            <h3 class="wl-note-title">Интерпретация нагрузки</h3>
            <p class="wl-note-text">
              Сводка гибридная (трекер + таблица) — цифры оценочные, не строго сопоставимы между месяцами.
              У руководителя ~236 ч «Адм/созвоны» — управленческая нагрузка, её выделяем отдельно от проектной.
              Шаронова и Гузаирова — почти целиком ЕИМ; Тельбизова — ЕИМ + АС МИП; Кузнецова — Сайт РУТ КОД.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-wl {
  --ov-text: #404040;
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

.wl-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.wl-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}

.wl-content {
  flex: 1;
  display: flex;
  min-height: 0;
  width: 100%;
}
.wl-dashboard {
  flex: 1;
  display: flex;
  gap: 24px;
  min-height: 0;
  width: 100%;
}

.wl-card {
  background: var(--ov-card);
  border: 1px solid var(--ov-card-border);
  border-radius: 42px;
  box-shadow: var(--ov-card-shadow);
  overflow: hidden;
}

.wl-chart-card {
  flex: 1.25;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  padding: 28px 24px;
}
.wl-chart-lbl {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 16px;
  color: var(--ov-text);
  margin: 0 0 8px;
}
.wl-chart-card :deep(.chart) {
  flex: 1;
  min-height: 0;
}

.wl-notes {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 0;
  min-width: 0;
}
.wl-note {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 16px;
  min-height: 0;
  padding: 28px 24px;
  border-radius: 42px;
}
.wl-note--start { justify-content: flex-start; }
.wl-note-title {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 24px;
  line-height: 28px;
  color: #02028A;
  margin: 0;
}
.wl-note-text {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 16px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}
</style>
