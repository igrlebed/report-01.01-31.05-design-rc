<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    value: string | number
    duration?: number
    delay?: number
    locale?: string
  }>(),
  { duration: 1300, delay: 0, locale: 'ru-RU' }
)

const parsed = computed(() => {
  const raw = String(props.value).trim()
  const match = raw.match(/-?\d[\d\s.,]*/)
  if (!match) return { prefix: raw, suffix: '', target: 0, decimals: 0, valid: false }

  const token = match[0]
  const prefix = raw.slice(0, match.index)
  const suffix = raw.slice((match.index ?? 0) + token.length)

  const normalized = token.replace(/\s/g, '').replace(',', '.')
  const target = parseFloat(normalized)
  const dot = normalized.indexOf('.')
  const decimals = dot === -1 ? 0 : normalized.length - dot - 1

  return { prefix, suffix, target, decimals, valid: Number.isFinite(target) }
})

const display = ref('')

function format(n: number) {
  const { prefix, suffix, decimals } = parsed.value
  const num = n.toLocaleString(props.locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
  return `${prefix}${num}${suffix}`
}

let raf = 0
let timer: ReturnType<typeof setTimeout> | undefined

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

function run() {
  const { target, valid } = parsed.value
  if (!valid) {
    display.value = String(props.value)
    return
  }

  const reduce =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    display.value = format(target)
    return
  }

  display.value = format(0)
  const start = performance.now()
  const step = (now: number) => {
    const t = Math.min((now - start) / props.duration, 1)
    display.value = format(target * easeOutCubic(t))
    if (t < 1) raf = requestAnimationFrame(step)
  }
  raf = requestAnimationFrame(step)
}

onMounted(() => {
  display.value = format(0)
  timer = setTimeout(run, props.delay)
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <span>{{ display }}</span>
</template>
