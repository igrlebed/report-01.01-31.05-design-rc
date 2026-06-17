<script setup lang="ts">
const props = defineProps<{ data: any }>()
const c = computed(() => props.data.ai.cvsm)
const phases = computed(() => c.value.phases as any[])

const tradTotalHours = computed(() => phases.value.reduce((s, p) => s + p.tradHours, 0))
const aiTotalHours = computed(() => phases.value.reduce((s, p) => s + p.aiHours, 0))
const maxTotal = computed(() => Math.max(tradTotalHours.value, aiTotalHours.value))

function pct(h: number) {
  return (h / maxTotal.value) * 100
}
</script>

<template>
  <section class="slide slide-cs">
    <header class="cs-head">
      <h1 class="cs-title">Нейросети: пример из реальной практики</h1>
    </header>

    <div class="cs-content">
      <div class="cs-intro">
        <h2 class="cs-lead">{{ c.lead }}</h2>
        <p class="cs-context">{{ c.context }}</p>
      </div>

      <div class="cs-tracks">
        <div class="cs-chart-cols">
          <div v-for="(p, i) in phases" :key="'h' + i" class="cs-col-head">{{ p.phase }}</div>
        </div>

        <div class="cs-track-block">
          <div class="cs-track-side">
            <span class="cs-track-name cs-track-name--ai">Дизайнер + ИИ</span>
            <span class="cs-track-meta cs-track-meta--ai">{{ c.aiTrack.actors }}</span>
          </div>
          <div class="cs-track-main">
            <div class="cs-bar">
              <div
                v-for="(p, i) in phases"
                :key="'a' + i"
                class="cs-seg-wrap"
                :style="{ width: pct(p.aiHours) + '%' }"
              >
                <div class="cs-seg cs-seg--ai" :class="'cs-seg--a' + i" />
                <span class="cs-seg-time cs-seg-time--ai">{{ p.aiLabel }}</span>
              </div>
            </div>
          </div>
          <div class="cs-total cs-total--ai">
            <span class="cs-total-lbl">Итого</span>
            <span class="cs-total-val">{{ c.aiTrack.total }}</span>
          </div>
        </div>

        <div class="cs-vs" aria-hidden="true">vs</div>

        <div class="cs-track-block">
          <div class="cs-track-side">
            <span class="cs-track-name">Традиционно</span>
            <span class="cs-track-meta">{{ c.tradTrack.actors }}</span>
          </div>
          <div class="cs-track-main">
            <div class="cs-bar">
              <div
                v-for="(p, i) in phases"
                :key="'t' + i"
                class="cs-seg-wrap"
                :style="{ width: pct(p.tradHours) + '%' }"
              >
                <div class="cs-seg cs-seg--trad" :class="'cs-seg--t' + i" />
                <span class="cs-seg-time">{{ p.tradLabel }}</span>
              </div>
            </div>
          </div>
          <div class="cs-total cs-total--trad">
            <span class="cs-total-lbl">Итого</span>
            <span class="cs-total-val">{{ c.tradTrack.total }}</span>
          </div>
        </div>
      </div>

      <div class="cs-phases">
        <article v-for="(p, i) in phases" :key="i" class="cs-phase">
          <div class="cs-phase-top">
            <h3 class="cs-phase-name">{{ p.phase }}</h3>
            <p class="cs-phase-roles">{{ p.rolesLine }}</p>
          </div>
          <div class="cs-phase-bottom">
            <p class="cs-phase-did">{{ p.did }}</p>
            <p class="cs-phase-time"><i>{{ p.tradLabel }}</i> → <b>{{ p.aiLabel }}</b></p>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-cs {
  --cs-text: #404040;
  --cs-muted: #737373;
  --cs-num: #02028a;
  --cs-card: #fafafa;
  --cs-card-border: #f2f2f2;
  --cs-card-shadow:
    34px 42px 54px 0 rgba(212, 212, 212, 0.09),
    8px 11px 30px 0 rgba(212, 212, 212, 0.1);

  padding: 24px;
  gap: 12px;
  font-family: 'Onest', -apple-system, BlinkMacSystemFont, sans-serif;
}

.cs-head {
  display: flex;
  align-items: center;
  padding: 12px 24px;
}
.cs-title {
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: 20px;
  line-height: 20px;
  color: var(--cs-muted);
  margin: 0;
}

.cs-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  padding: 0 24px;
}

.cs-intro {
  display: flex;
  flex-direction: column;
  gap: 0;
  flex-shrink: 0;
}

.cs-lead {
  margin: 0;
  max-width: 1200px;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 56px;
  line-height: 56px;
  letter-spacing: -1.12px;
  color: var(--cs-num);
}
.cs-context {
  margin: 24px 0 0;
  max-width: 1200px;
  font-size: 16px;
  line-height: 22px;
  color: var(--cs-muted);
}

/* ===== Tracks ===== */
.cs-tracks {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  margin-top: 28px;
  margin-bottom: 20px;
  min-height: 0;
}
.cs-chart-cols {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin-left: 259px;
  margin-bottom: 4px;
}
.cs-col-head {
  font-family: 'Onest', sans-serif;
  font-size: 13px;
  line-height: 16px;
  color: #a3a3a3;
}
.cs-track-block {
  display: flex;
  align-items: flex-start;
  gap: 22px;
}
.cs-track-side {
  flex: 0 0 235px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 14px;
}
.cs-track-name {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
  color: #8a8a93;
}
.cs-track-name--ai {
  color: var(--cs-num);
}
.cs-track-meta {
  font-size: 13px;
  line-height: 17px;
  color: #a3a3a3;
}
.cs-track-meta--ai {
  color: var(--cs-muted);
}
.cs-track-main {
  flex: 1;
  min-width: 0;
}
.cs-bar {
  display: flex;
  gap: 4px;
  height: 56px;
  min-width: 0;
  padding: 0;
  background: #ececf2;
  border-radius: 10px;
  overflow: hidden;
}
.cs-seg-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.cs-seg {
  flex: 1;
  min-height: 56px;
  min-width: 6px;
  border-radius: 0;
}
.cs-seg-wrap:first-child .cs-seg {
  border-radius: 10px 0 0 10px;
}
.cs-seg-wrap:last-child .cs-seg {
  border-radius: 0 10px 10px 0;
}
.cs-seg-wrap:only-child .cs-seg {
  border-radius: 10px;
}
.cs-seg-time {
  font-size: 12px;
  line-height: 14px;
  color: #a3a3a3;
  white-space: nowrap;
}
.cs-seg-time--ai {
  color: var(--cs-muted);
  font-weight: 500;
}
.cs-seg--t0 { background: #b6b6c2; }
.cs-seg--t1 { background: #c8c8d2; }
.cs-seg--t2 { background: #dadae1; }
.cs-seg--a0 { background: #0000bb; }
.cs-seg--a1 { background: #3a3ad0; }
.cs-seg--a2 { background: #6a6ae2; }
.cs-total {
  flex: 0 0 120px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding-top: 10px;
  text-align: right;
}
.cs-total-lbl {
  font-size: 12px;
  line-height: 14px;
  color: #a3a3a3;
}
.cs-total-val {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 18px;
  line-height: 22px;
}
.cs-total--trad .cs-total-val {
  color: #8a8a93;
}
.cs-total--ai .cs-total-val {
  color: var(--cs-num);
}
.cs-vs {
  margin-left: 259px;
  font-family: 'Tektur', sans-serif;
  font-size: 14px;
  line-height: 18px;
  color: #c4c4d4;
  letter-spacing: 0.04em;
}

/* ===== Phase cards ===== */
.cs-phases {
  flex: 0 1 auto;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  min-height: 0;
}
.cs-phase {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 320px;
  padding: 28px 24px;
  background: var(--cs-card);
  border: 1px solid var(--cs-card-border);
  border-radius: 28px;
  box-shadow: var(--cs-card-shadow);
}
.cs-phase-top,
.cs-phase-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.cs-phase-bottom {
  gap: 16px;
  padding-top: 20px;
}
.cs-phase-name {
  margin: 0;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: 28px;
  line-height: 32px;
  color: var(--cs-num);
}
.cs-phase-roles {
  margin: 0;
  font-size: 14px;
  line-height: 18px;
  color: var(--cs-muted);
}
.cs-phase-did {
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  color: var(--cs-muted);
}
.cs-phase-time {
  margin: 0;
  font-size: 14px;
  line-height: 18px;
}
.cs-phase-time i {
  font-style: normal;
  color: #a3a3a3;
}
.cs-phase-time b {
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  color: #0000bb;
}
</style>
