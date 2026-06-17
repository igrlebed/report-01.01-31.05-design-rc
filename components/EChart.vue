<script setup lang="ts">
defineProps<{ option: Record<string, unknown> }>()
const emit = defineEmits<{ click: [params: unknown] }>()

const chartRef = ref<{ chart?: { setOption: (o: unknown, lazy?: boolean) => void } } | null>(null)

defineExpose({
  getInstance: () => chartRef.value?.chart
})
</script>

<template>
  <ClientOnly>
    <VChart ref="chartRef" class="chart" :option="option" autoresize @click="emit('click', $event)" />
    <template #fallback>
      <div class="chart" />
    </template>
  </ClientOnly>
</template>
