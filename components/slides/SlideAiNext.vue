<script setup lang="ts">
const props = defineProps<{ data: any }>()
const ai = computed(() => props.data.ai)

const pipeIcons = ['pi-search', 'pi-users', 'pi-objects-column', 'pi-verified']
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
        <div class="pipeline">
          <template v-for="(p, i) in ai.pipeline" :key="p.step">
            <div class="pipe-step">
              <div class="pipe-icon"><i class="pi" :class="pipeIcons[i]" /></div>
              <div class="pipe-body">
                <div class="pipe-name">{{ p.step }}</div>
                <div class="pipe-tools">{{ p.tools }}</div>
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
            <div class="evo-box evo-now">
              <div class="evo-icon"><i class="pi pi-image" /></div>
              <div class="evo-tag">Сейчас</div>
              <p>{{ ai.evolution.now }}</p>
            </div>
            <i class="pi pi-arrow-right evo-arrow" />
            <div class="evo-box evo-target">
              <div class="evo-icon"><i class="pi pi-code" /></div>
              <div class="evo-tag">Цель</div>
              <p>{{ ai.evolution.target }}</p>
            </div>
          </div>
        </div>

        <div class="card road-card">
          <h3 class="card-title">Дорожная карта</h3>
          <div class="roadmap">
            <div v-for="(step, i) in ai.roadmap" :key="i" class="road-step">
              <div class="road-num">{{ i + 1 }}</div>
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

/* Конвейер */
.pipe-card { min-height: 0; }
.pipeline {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 0;
}
.pipe-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  background: var(--brand-soft);
  border-radius: 16px;
  padding: 18px 20px;
  margin: 5px 0;
}
.pipe-icon {
  width: 46px; height: 46px; border-radius: 12px; flex: none;
  background: var(--brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px;
}
.pipe-body { display: flex; flex-direction: column; gap: 4px; }
.pipe-name { font-weight: 800; font-size: 17px; color: var(--ink); line-height: 1.2; }
.pipe-tools { color: var(--brand); font-size: 13px; margin-top: 4px; font-weight: 600; }
.pipe-arrow { color: var(--brand); align-self: center; font-size: 18px; opacity: 0.55; }

/* Эволюция */
.evo-card { min-height: 0; }
.evo-row { display: flex; align-items: stretch; gap: 16px; flex: 1; min-height: 0; }
.evo-box {
  flex: 1;
  border-radius: 16px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.evo-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; margin-bottom: 12px;
}
.evo-now { background: #f1f1f7; border: 1px dashed #c9cbe0; }
.evo-now .evo-icon { background: #e0e1ee; color: var(--muted); }
.evo-target { background: linear-gradient(145deg, var(--brand) 0%, #2a2ad6 100%); color: #fff; }
.evo-target .evo-icon { background: rgba(255, 255, 255, 0.18); color: #fff; }
.evo-box p { margin: 10px 0 0; font-size: 16px; line-height: 1.5; font-weight: 500; }
.evo-tag { font-size: 12px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; opacity: 0.85; }
.evo-now .evo-tag { color: var(--muted); }
.evo-arrow { color: var(--brand); align-self: center; font-size: 24px; }

/* Дорожная карта — в стилистике .callout */
.road-card { min-height: 0; display: flex; flex-direction: column; }
.roadmap { display: flex; flex-direction: column; gap: 14px; flex: 1; min-height: 0; }
.road-step {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 20px 22px;
  background: var(--brand-soft);
  border-left: 4px solid var(--brand);
  border-radius: 12px;
  min-height: 0;
}
.road-num {
  width: 36px; height: 36px; border-radius: 10px; flex: none;
  background: var(--brand); color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-weight: 800; font-size: 16px;
}
.road-text {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--ink);
  line-height: 1.45;
  display: flex;
  align-items: center;
}
</style>
