<script setup lang="ts">
import { BRAND, BRAND_SOFT, MUTED, OK, baseTooltip, baseTextStyle } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()

const workload = computed(() => [...props.data.workload].sort((a, b) => a.total - b.total))

const SEGMENT_DUR = 500
const ROW_STAGGER = 80

const option = computed(() => ({
  textStyle: baseTextStyle,
  tooltip: {
    ...baseTooltip,
    trigger: 'item',
    formatter: (p: any) => {
      const w = workload.value[p.dataIndex]
      const parts = w.byProject
        .map((b: any) => `${b.project}: <b>${b.hours}</b> ч`)
        .join('<br/>')
      return `<b>${w.full}</b> — всего ${w.total} ч<br/><span style="opacity:.6">${p.seriesName}: ${p.value} ч</span><br/><hr style="opacity:.2;margin:6px 0"/>${parts}`
    }
  },
  legend: { bottom: 0, icon: 'circle', textStyle: { color: MUTED } },
  grid: { left: 8, right: 40, top: 12, bottom: 38, containLabel: true },
  xAxis: { type: 'value', splitLine: { lineStyle: { color: '#eef0f7' } }, axisLabel: { color: MUTED, formatter: '{value} ч' } },
  yAxis: {
    type: 'category',
    data: workload.value.map((w) => w.name),
    axisLabel: { color: MUTED, fontWeight: 600 },
    axisLine: { lineStyle: { color: '#e0e1ee' } }
  },
  series: [
    {
      name: 'Янв–фев (трекер)',
      type: 'bar',
      stack: 'h',
      data: workload.value.map((w) => w.janFeb),
      itemStyle: { color: BRAND_SOFT, borderRadius: [6, 0, 0, 6] },
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
      itemStyle: { color: BRAND, borderRadius: [0, 6, 6, 0] },
      animationDuration: SEGMENT_DUR,
      animationEasing: 'cubicOut',
      animationDelay: (idx: number) => SEGMENT_DUR + idx * ROW_STAGGER,
      label: {
        show: true,
        position: 'right',
        formatter: (p: any) => `${workload.value[p.dataIndex].total} ч`,
        color: MUTED,
        fontWeight: 700
      },
      emphasis: { focus: 'series' }
    }
  ]
}))
</script>

<template>
  <section class="slide">
    <div class="slide-head">
      <div>
        <div class="slide-kicker">Слайд 3 / 5</div>
        <h1 class="slide-title">Нагрузка команды и нюанс учёта времени</h1>
      </div>
      <div class="slide-sub">Гибрид: трекер (янв–фев) + ручная таблица (март–май)</div>
    </div>

    <div class="grid grid-2">
      <div class="card">
        <h3 class="card-title">Нагрузка по людям за период · hover → разбивка по проектам</h3>
        <EChart :option="option" />
      </div>

      <div class="notes-col">
        <div class="note-block">
          <h3 class="note-title">Почему нагрузку считаем по таблице, а не по трекеру</h3>
          <p class="note-text">
            Поле «Затрачено времени» в выгрузке суммирует списания всех участников задачи на одного исполнителя — по выгрузке нельзя понять, кто сколько сделал.
          </p>
        </div>

        <div class="note-block note-block--start">
          <h3 class="note-title">Доказательство: сумма по людям = «Затрачено» в трекере</h3>
          <table class="proof-table">
            <thead>
              <tr><th>Задача</th><th>Списания по людям</th><th>Трекер</th></tr>
            </thead>
            <tbody>
              <tr v-for="row in data.proof" :key="row.key">
                <td><b>{{ row.key }}</b></td>
                <td class="proof-eq">{{ row.parts.map((p:any[]) => p[1]).join(' + ') }} = <b>{{ row.tracker }}</b></td>
                <td class="tag-ok">{{ row.tracker }} ч ✓</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="note-block">
          <h3 class="note-title">Интерпретация нагрузки</h3>
          <p class="note-text">
            Сводка гибридная (трекер + таблица) — цифры оценочные, не строго сопоставимы между месяцами.
            У руководителя ~236 ч «Адм/созвоны» — управленческая нагрузка, её выделяем отдельно от проектной.
            Шаронова и Гузаирова — почти целиком ЕИМ; Тельбизова — ЕИМ + АС МИП; Кузнецова — Сайт РУТ КОД.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
