<script setup lang="ts">
import { useChartTheme } from '~/composables/useBrand'

const props = defineProps<{ data: any }>()
const theme = useChartTheme()
const { hiContrast } = useHiContrast()

const map = computed(() => props.data.ai.map)
const anchor = computed(() => map.value.anchor)
const chartRef = ref<{ getInstance: () => { setOption: (o: unknown, lazy?: boolean) => void } | undefined } | null>(null)
const hoveredTaskId = ref<string | null>(null)

const DEPT_COLORS = ['#0000bb', '#2fa86a', '#0071e3', '#e0556a']
const DEPT_COLORS_HC = ['#0000bb', '#1f7a4d', '#0a4a9e', '#b23a4a']

const R_DEPT = 175
const R_SPEC = 300
const R_TASK = 450

const RIGHT_LABEL_TASKS = new Set(['SEO-аудит', 'Проверка гипотез'])

function isRightLabelTask(name: string) {
  return RIGHT_LABEL_TASKS.has(name)
}

const deptColors = computed(() => (hiContrast.value ? DEPT_COLORS_HC : DEPT_COLORS))

const taskCards = computed(() => {
  const colors = deptColors.value
  const cards: {
    id: string
    label: string
    full: string
    dept: string
    role: string
    color: string
  }[] = []

  map.value.departments.forEach((d: any, di: number) => {
    d.specialists.forEach((sp: any, si: number) => {
      sp.tasks.forEach((tk: any, ti: number) => {
        cards.push({
          id: `t-${di}-${si}-${ti}`,
          label: tk.label,
          full: tk.full,
          dept: d.dept,
          role: sp.role,
          color: colors[di % colors.length]
        })
      })
    })
  })
  return cards
})

const mean = (arr: number[]) => arr.reduce((s, n) => s + n, 0) / arr.length

function hash01(id: string) {
  let h = 0
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0
  return (Math.abs(h) % 1000) / 1000
}

function swayFor(id: string) {
  if (id === 'center') return { amp: 0, speed: 0, phase: 0 }
  if (id.startsWith('d-')) return { amp: 1.2, speed: 0.28, phase: hash01(id) * Math.PI * 2 }
  if (id.startsWith('s-')) return { amp: 1.6, speed: 0.32, phase: hash01(id) * Math.PI * 2 }
  return { amp: 2, speed: 0.36, phase: hash01(id) * Math.PI * 2 }
}

function chainForTask(taskId: string | null): Set<string> {
  if (!taskId) return new Set()
  const m = taskId.match(/^t-(\d+)-(\d+)-/)
  if (!m) return new Set([taskId])
  const [, di, si] = m
  return new Set(['center', `d-${di}`, `s-${di}-${si}`, taskId])
}

type MindNode = Record<string, unknown> & {
  id: string
  baseX: number
  baseY: number
  swayAmp: number
  swaySpeed: number
  swayPhase: number
}

function buildGraph(m: any, hc: boolean) {
  const colors = hc ? DEPT_COLORS_HC : DEPT_COLORS
  const edge = hc ? '#a3a3a3' : '#d6d6ea'
  const labelColor = hc ? '#262626' : '#404040'

  const categories = m.departments.map((d: any, i: number) => ({
    name: d.dept,
    itemStyle: { color: colors[i % colors.length] }
  }))

  const nodes: MindNode[] = []
  const links: any[] = []

  const totalLeaves = m.departments.reduce(
    (s: number, d: any) => s + d.specialists.reduce((ss: number, sp: any) => ss + sp.tasks.length, 0),
    0
  )
  const step = (2 * Math.PI) / totalLeaves
  let leaf = 0

  const pushNode = (id: string, x: number, y: number, rest: Record<string, unknown>) => {
    const { amp, speed, phase } = swayFor(id)
    nodes.push({
      id,
      baseX: x,
      baseY: y,
      swayAmp: amp,
      swaySpeed: speed,
      swayPhase: phase,
      x,
      y,
      ...rest
    })
  }

  pushNode('center', 0, 0, {
    name: m.center,
    symbolSize: 96,
    category: -1,
    itemStyle: {
      color: hc ? '#0000bb' : '#02028a',
      shadowBlur: 28,
      shadowColor: 'rgba(0,0,187,0.35)'
    },
    label: {
      show: true,
      position: 'bottom',
      distance: 8,
      fontSize: 15,
      fontWeight: 600,
      color: hc ? '#0000bb' : '#02028a',
      fontFamily: 'Tektur, sans-serif'
    }
  })

  m.departments.forEach((d: any, di: number) => {
    const deptColor = colors[di % colors.length]
    const deptId = `d-${di}`
    const specAngles: number[] = []

    d.specialists.forEach((sp: any, si: number) => {
      const specId = `s-${di}-${si}`
      const taskAngles: number[] = []

      sp.tasks.forEach((tk: any, ti: number) => {
        const a = step * (leaf + 0.5) - Math.PI / 2
        leaf++
        taskAngles.push(a)
        const x = Math.cos(a) * R_TASK
        const y = Math.sin(a) * R_TASK
        const taskId = `t-${di}-${si}-${ti}`
        const labelRight = isRightLabelTask(tk.label)
        pushNode(taskId, x, y, {
          name: tk.label,
          value: tk.full,
          tooltipAlign: labelRight ? 'right' : 'default',
          symbol: 'circle',
          symbolSize: 14,
          category: di,
          itemStyle: {
            color: '#ffffff',
            borderColor: deptColor,
            borderWidth: hc ? 3.5 : 3,
            shadowBlur: 4,
            shadowColor: 'rgba(0,0,0,0.06)'
          },
          label: {
            show: true,
            position: labelRight ? 'right' : 'bottom',
            distance: 5,
            fontSize: 11,
            lineHeight: 14,
            color: labelColor,
            fontFamily: 'Onest, sans-serif',
            fontWeight: hc ? 500 : 400,
            overflow: 'none'
          }
        })
        links.push({ source: specId, target: taskId, lineStyle: { width: 1 } })
      })

      const sa = mean(taskAngles)
      specAngles.push(sa)
      const sx = Math.cos(sa) * R_SPEC
      const sy = Math.sin(sa) * R_SPEC
      pushNode(specId, sx, sy, {
        name: sp.role,
        symbolSize: 34,
        category: di,
        itemStyle: { color: deptColor, opacity: 0.85 },
        label: {
          show: true,
          position: sx < 0 ? 'left' : 'right',
          fontSize: 13,
          fontWeight: 600,
          color: labelColor,
          fontFamily: 'Onest, sans-serif'
        }
      })
      links.push({ source: deptId, target: specId, lineStyle: { width: 1.5 } })
    })

    const da = mean(specAngles)
    const dx = Math.cos(da) * R_DEPT
    const dy = Math.sin(da) * R_DEPT
    pushNode(deptId, dx, dy, {
      name: d.dept,
      symbolSize: 48,
      category: di,
      itemStyle: { color: deptColor },
      label: {
        show: true,
        position: 'bottom',
        distance: 8,
        fontSize: 13,
        fontWeight: 700,
        color: labelColor,
        fontFamily: 'Onest, sans-serif',
        overflow: 'none'
      }
    })
    links.push({ source: 'center', target: deptId, lineStyle: { width: 2.2 } })
  })

  return { categories, nodes, links, edge, labelColor }
}

const graph = computed(() => buildGraph(map.value, hiContrast.value))

function styledNodes(sec: number, chain: Set<string>, active: boolean) {
  const hc = hiContrast.value
  const dim = 0.14

  return graph.value.nodes.map((n) => {
    const { baseX, baseY, swayAmp, swaySpeed, swayPhase, id, ...rest } = n
    const wobble = swayAmp ? swayAmp * Math.sin(sec * swaySpeed + swayPhase) : 0
    const drift = swayAmp ? swayAmp * 0.7 * Math.cos(sec * swaySpeed * 0.85 + swayPhase) : 0
    const inChain = !active || chain.has(id)
    const nodeOpacity = inChain ? 1 : dim

    const itemStyle = { ...(rest.itemStyle as Record<string, unknown>) }
    if (id.startsWith('t-') && active && chain.has(id)) {
      itemStyle.borderWidth = hc ? 4.5 : 4
      itemStyle.shadowBlur = 12
    }

    return {
      ...rest,
      id,
      x: baseX + wobble,
      y: baseY + drift,
      opacity: nodeOpacity,
      itemStyle: { ...itemStyle, opacity: nodeOpacity },
      label: {
        ...(rest.label as Record<string, unknown>),
        opacity: nodeOpacity,
        fontWeight: active && chain.has(id) && id.startsWith('t-') ? 600 : (rest.label as any)?.fontWeight
      },
      symbolSize: active && chain.has(id) && id.startsWith('t-') ? 16 : rest.symbolSize
    }
  })
}

function styledLinks(chain: Set<string>, active: boolean) {
  const { links, edge } = graph.value
  return links.map((l) => {
    const lit = active && chain.has(l.source) && chain.has(l.target)
    return {
      ...l,
      lineStyle: {
        color: edge,
        width: lit ? Math.max(l.lineStyle?.width ?? 1, 2.2) : l.lineStyle?.width,
        opacity: active ? (lit ? 1 : 0.1) : 0.7,
        curveness: 0.05
      }
    }
  })
}

function tooltipPosition(
  point: number[],
  params: { data?: { tooltipAlign?: string } },
  _dom: HTMLElement,
  _rect: unknown,
  size: { contentSize: number[]; viewSize: number[] }
) {
  if (params.data?.tooltipAlign !== 'right') return undefined

  const [x, y] = point
  const [cw, ch] = size.contentSize
  const [vw, vh] = size.viewSize
  let left = x + 14
  let top = y - ch / 2

  if (left + cw > vw - 8) left = Math.max(8, vw - cw - 8)
  if (top < 8) top = 8
  if (top + ch > vh - 8) top = vh - ch - 8

  return [left, top]
}

const option = computed(() => {
  const t = theme.value
  const { categories, nodes, links, edge } = graph.value

  return {
    textStyle: t.textStyle,
    tooltip: {
      ...t.tooltip,
      position: tooltipPosition,
      formatter: (p: any) => {
        if (p.dataType !== 'node') return ''
        const isTask = typeof p.data?.id === 'string' && p.data.id.startsWith('t-')
        if (isTask && p.data.value) {
          return `<b>${p.data.name}</b>${t.ttDivider()}${p.data.value}`
        }
        return `<b>${p.data.name}</b>`
      }
    },
    series: [
      {
        type: 'graph',
        layout: 'none',
        roam: false,
        categories,
        nodes,
        links,
        edgeSymbol: ['none', 'none'],
        lineStyle: { color: edge, opacity: 0.7, curveness: 0.05 },
        animationDuration: 900,
        animationEasing: 'cubicOut',
        animationDurationUpdate: 0
      }
    ]
  }
})

let raf = 0
let t0 = 0

function onGraphMouseOver(params: any) {
  const id = params?.data?.id
  if (params?.dataType === 'node' && typeof id === 'string' && id.startsWith('t-')) {
    hoveredTaskId.value = id
    return
  }
  hoveredTaskId.value = null
}

function onGraphGlobalOut() {
  hoveredTaskId.value = null
}

function tick(now: number) {
  if (!t0) t0 = now
  const sec = (now - t0) / 1000
  const inst = chartRef.value?.getInstance()
  if (inst) {
    const active = !!hoveredTaskId.value
    const chain = chainForTask(hoveredTaskId.value)
    inst.setOption(
      {
        series: [{ nodes: styledNodes(sec, chain, active), links: styledLinks(chain, active) }]
      },
      false
    )
  }
  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  raf = requestAnimationFrame(tick)
})

onUnmounted(() => {
  cancelAnimationFrame(raf)
})

watch([map, hiContrast], () => {
  t0 = 0
})
</script>

<template>
  <section class="slide slide-nx">
    <header class="nx-head">
      <h1 class="nx-title">Нейросети: какие роли закрываем</h1>
      <div class="nx-anchor">
        <span><b>{{ anchor.departments }}</b> отдела</span>
        <span class="nx-anchor-dot">·</span>
        <span><b>{{ anchor.specialists }}</b> специалистов</span>
        <span class="nx-anchor-dot">·</span>
        <span><b>{{ anchor.tasks }}</b> задач</span>
      </div>
    </header>

    <div class="nx-content">
      <aside class="nx-cards">
        <button
          v-for="card in taskCards"
          :key="card.id"
          type="button"
          class="nx-card"
          :class="{ 'nx-card--active': hoveredTaskId === card.id }"
          :style="{ '--nx-accent': card.color }"
          @mouseenter="hoveredTaskId = card.id"
          @mouseleave="hoveredTaskId = null"
        >
          <div class="nx-card-body">
            <span class="nx-card-dot" aria-hidden="true" />
            <div class="nx-card-stack">
              <h3 class="nx-card-title">{{ card.label }}</h3>
              <p class="nx-card-text">{{ card.full }}</p>
              <div class="nx-card-meta">
                <span class="nx-card-tag">{{ card.dept }}</span>
                <span class="nx-card-tag">{{ card.role }}</span>
              </div>
            </div>
          </div>
        </button>
      </aside>

      <div class="nx-map">
        <EChart ref="chartRef" :option="option" @mouseover="onGraphMouseOver" @globalout="onGraphGlobalOut" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-nx {
  --nx-card: #fafafa;
  --nx-card-border: #f2f2f2;
  --nx-card-shadow:
    34px 42px 54px 0 rgba(212, 212, 212, 0.09),
    8px 11px 30px 0 rgba(212, 212, 212, 0.1);

  padding: 24px;
  gap: 16px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.nx-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
}
.nx-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: #737373;
  margin: 0;
}
.nx-anchor {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Onest', sans-serif;
  font-size: 14px;
  color: #737373;
}
.nx-anchor b {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  color: #02028a;
}
.nx-anchor-dot {
  color: #c4c4d4;
}

.nx-content {
  flex: 1;
  display: flex;
  gap: 20px;
  min-height: 0;
  width: 100%;
}

.nx-cards {
  flex: 0 0 42%;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(5, minmax(0, 1fr));
  gap: 10px;
  min-height: 0;
  height: 100%;
  padding-right: 4px;
}

.nx-card:last-child {
  grid-column: 1 / -1;
}

.nx-card {
  display: flex;
  align-items: center;
  height: 100%;
  min-height: 0;
  padding: 16px 18px;
  text-align: left;
  background: var(--nx-card);
  border: 1px solid var(--nx-card-border);
  border-radius: 20px;
  box-shadow: var(--nx-card-shadow);
  cursor: default;
  font: inherit;
  transition: border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease;
}
.nx-card:hover,
.nx-card--active {
  border-color: color-mix(in srgb, var(--nx-accent) 35%, var(--nx-card-border));
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--nx-accent) 20%, transparent),
    var(--nx-card-shadow);
  transform: translateY(-1px);
}
.nx-card-dot {
  flex: 0 0 8px;
  width: 8px;
  height: 8px;
  margin-top: 5px;
  border-radius: 50%;
  background: var(--nx-accent);
}
.nx-card-body {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  width: 100%;
  min-width: 0;
}
.nx-card-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  flex: 1;
  min-width: 0;
}
.nx-card-title {
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 15px;
  line-height: 18px;
  color: #02028a;
  text-align: left;
}
.nx-card-text {
  margin: 0;
  font-size: 12px;
  line-height: 16px;
  color: #737373;
  text-align: left;
}
.nx-card-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 6px;
}
.nx-card-tag {
  font-size: 11px;
  line-height: 14px;
  color: #737373;
  background: #f5f5f5;
  border: 1px solid #ededed;
  border-radius: 999px;
  padding: 2px 8px;
}

.nx-map {
  flex: 1;
  display: flex;
  min-width: 0;
  min-height: 0;
  background: var(--nx-card);
  border: 1px solid var(--nx-card-border);
  border-radius: 28px;
  box-shadow: var(--nx-card-shadow);
  overflow: hidden;
}
.nx-map :deep(.chart) {
  flex: 1;
  min-height: 0;
  width: 100%;
}
</style>
