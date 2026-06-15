<script setup lang="ts">
defineProps<{ option: Record<string, unknown> }>()
</script>

<template>
  <ClientOnly>
    <VChart class="chart" :option="option" autoresize />
    <template #fallback>
      <div class="chart" />
    </template>
  </ClientOnly>
</template>
