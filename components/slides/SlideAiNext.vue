<script setup lang="ts">
const props = defineProps<{ data: any }>()
const ai = computed(() => props.data.ai)

function splitTools(tools: string) {
  return tools.split(/\s*[·→]\s*/).filter(Boolean)
}
</script>

<template>
  <section class="slide">
    <div class="slide-head">
      <div>
        <div class="slide-kicker">Слайд 5 / 5</div>
        <h1 class="slide-title">Нейросети: что будем делать</h1>
      </div>
      <div class="slide-sub">От прототипа-картинки к фундаменту продукта</div>
    </div>

    <div class="next-grid">
      <!-- Конвейер: вертикальная колонка слева, высокая и заметная -->
      <div class="card pipe-card">
        <h3 class="card-title">ИИ-конвейер уже закрывает всю цепочку</h3>
        <div class="pipeline ai-cards">
          <template v-for="(p, i) in ai.pipeline" :key="p.step">
            <div class="pipe-step ai-card">
              <div class="ai-card-head">
                <span class="ai-card-proj">{{ p.step }}</span>
              </div>
              <p v-if="p.desc" class="ai-card-did">{{ p.desc }}</p>
              <div class="ai-tools" style="margin-top: 10px">
                <span v-for="t in splitTools(p.tools)" :key="t" class="ai-tool">{{ t }}</span>
              </div>
            </div>
            <i v-if="i < ai.pipeline.length - 1" class="pi pi-arrow-down pipe-arrow" />
          </template>
        </div>
      </div>

      <!-- Правая колонка: эволюция (сверху) + дорожная карта (снизу) -->
      <div class="next-right">
        <div class="card evo-card">
          <h3 class="card-title">Эволюция роли прототипа</h3>
          <div class="evo-row">
            <div class="evo-box evo-now ai-card">
              <div class="evo-tag">Сейчас</div>
              <p>{{ ai.evolution.now }}</p>
            </div>
            <i class="pi pi-arrow-right evo-arrow" />
            <div class="evo-box evo-target ai-card">
              <div class="evo-tag">Цель</div>
              <p>{{ ai.evolution.target }}</p>
            </div>
          </div>
        </div>

        <div class="card road-card">
          <h3 class="card-title">Дорожная карта</h3>
          <div class="roadmap ai-cards">
            <div v-for="(step, i) in ai.roadmap" :key="i" class="road-step ai-card">
              <span class="road-num">{{ i + 1 }}</span>
              <div class="road-text">{{ step }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.next-grid {
  flex: 1;
  display: grid;
  grid-template-columns: 0.92fr 1.08fr;
  gap: 22px;
  min-height: 0;
}
.next-right {
  display: grid;
  grid-template-rows: 0.85fr 1fr;
  gap: 22px;
  min-height: 0;
}

.pipe-card { min-height: 0; gap: 12px; }
.pipeline { justify-content: space-between; }
.pipe-step { margin: 0; padding: 18px 20px; border-radius: 16px; }
.pipe-arrow { color: var(--brand); align-self: center; font-size: 18px; opacity: 0.55; }

.evo-card { min-height: 0; gap: 12px; }
.evo-row { display: flex; align-items: stretch; gap: 16px; flex: 1; min-height: 0; }
.evo-box {
  flex: 1;
  padding: 22px;
  border-radius: 16px;
}
.evo-box p { margin: 10px 0 0; font-size: 16px; line-height: 1.5; font-weight: 500; color: var(--muted); }
.evo-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
.evo-now { background: #f6f7fa; border: 1px dashed #d4d5e0; }
.evo-now .evo-tag { color: var(--muted); }
.evo-target .evo-tag { color: var(--brand); }
.evo-target p { color: var(--ink); }
.evo-arrow { color: var(--brand); align-self: center; font-size: 24px; opacity: 0.7; }

.road-card { min-height: 0; display: flex; flex-direction: column; gap: 12px; }
.roadmap { gap: 14px; }
.road-step {
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 16px;
  padding: 20px 22px;
  border-radius: 14px;
}
.road-num {
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: 10px;
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 14px;
  background: var(--brand-soft);
  color: var(--brand);
}
.road-text {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.45;
}
</style>
