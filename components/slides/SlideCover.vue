<template>
  <section class="slide-cover">
    <div class="cv-pixels" aria-hidden="true">
      <img src="/img/cover-staircase.svg" alt="" class="cv-pixels-img" />
    </div>

    <div class="cv-hero">
      <div class="cv-headline">
        <h1 class="cv-title">
          Отчёт дизайн-отдела<br />за первое полугодие
        </h1>
        <p class="cv-sub">
          Итоги работы, ключевые метрики<br />и планы на второе полугодие
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.slide-cover {
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  min-height: 0;
  padding: 24px 24px 0;
  background: #0000bb;
}

.cv-pixels {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.cv-pixels-img {
  position: absolute;
  top: 50%;
  left: 50%;
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  transform: translate(-50%, -50%);
}

.cv-hero {
  position: relative;
  z-index: 1;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 0;
}

.cv-headline {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  text-align: center;
}

.cv-title {
  margin: 0;
  max-width: 942px;
  font-family: 'Tektur', sans-serif;
  font-weight: 500;
  font-size: clamp(40px, 5.556vw, 80px);
  line-height: 1;
  letter-spacing: -0.02em;
  color: #f5f5f5;
}

.cv-sub {
  margin: 0;
  max-width: 406px;
  font-family: 'Onest', sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 1.667vw, 24px);
  line-height: 1.2;
  color: #d3d3d3;
}
</style>
