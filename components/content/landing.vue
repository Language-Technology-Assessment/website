<template>
  <div class="landing" ref="mainelement">
    <div
      class="frame"
      :style="{ transform: `translateY(${y / 2}px)`, opacity: 1 - y / height }"
    >
      <NuxtPicture
        src="https://raw.githubusercontent.com/Language-Technology-Assessment/European-open-AI-index/main/images/sphere.png"
        sizes="800px lg:1200px"
        class="sphere"
        format="webp,png"
      ></NuxtPicture>
      <div class="animation-frame">
        <div class="slot">
          <slot></slot>
        </div>
        <div class="notesframe" :style="{ opacity: 1 - (y / height) * 2 }">
          <div class="notes">
            <slot :use="$slots.notes" v-if="$slots.notes"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useWindowScroll, useWindowSize } from "@vueuse/core";
const mainelement = ref(null);
const { y } = useWindowScroll();
const { height } = useWindowSize();
</script>

<style lang="less" scoped>
@keyframes landin {
  100% {
    opacity: 1;
    transform: translateY(0rem);
  }
}

.landing {
  height: calc(100vh - 4rem);
  min-height: 38rem;
  margin-bottom: 4rem;
  position: relative;
  background: var(--bg2);
  margin-top: 0 !important;
  overflow: hidden;
  display: flex;
  // align-items: center;
  justify-content: center;
  padding-top: 8rem;

  @media (max-width: 50rem) {
    margin-bottom: 1rem;
  }
  @media (orientation: portrait), (min-width: 1600px) {
    min-height: 35rem;
    max-height: 46rem;
  }

  .frame {
    display: block;
    position: relative;
    z-index: 3;
    overflow: visible;
    .row();
    display: flex;
    align-items: flex-end;
    padding-bottom: 4rem;
    @media (orientation: portrait) {
      padding-bottom: 2rem;
      @media (max-width: 30rem) {
        padding-bottom: 1rem;
      }
    }

    .logo {
      margin-bottom: 2rem;
      max-width: 100%;
      margin: 0 auto 2rem;
      display: block;
      width: 10rem;

      :deep(path) {
        fill: var(--fg);
      }
    }

    .animation-frame {
      opacity: 0;
      // transform: scale(.9);
      transform: translateY(2rem);
      transform-origin: top left;
      animation: landin 2s @easeInOutExpo 0.25s 1 forwards;
      position: relative;
      z-index: 2;
      width: 100%;
      font-size: 1.5rem;
      font-family: "InterDisplay", "Helvetica Neue", Helvetica, sans-serif;

      padding-top: 0;

      .slot {
        margin-bottom: 2rem;
      }
    }

    :deep(h1) {
      font-size: 3rem;
      width: 9.55em;
      text-align: left;
      margin: 0 0 2rem;
      font-family: "InterDisplay", "Helvetica Neue", Helvetica, sans-serif;
    }

    :deep(p) {
      margin: 0 0 1rem;
      width: 20em;
      max-width: 100%;
      color: var(--fg);
    }

    :deep(.animation-frame > .slot > p > a) {
      background: var(--fg);
      color: var(--bg);
      text-decoration: none;
      border-radius: 0.25rem;
      padding: 0.5em 1em;
      margin-top: 0.5em;
      display: inline-block;
      margin-right: 1em;
      font-size: 0.75rem;
      font-weight: 600;

      &:hover {
        background: var(--link);
      }
    }
  }
}

.notesframe {
  right: 0;
  // left: 0;
  // bottom: 2rem;
  font-size: 0.75rem;
  width: 20rem;
  z-index: 4;

  .notes {
    // .row();
    opacity: 0.5;

    :deep(p) {
      margin: 0;
      width: 26rem;
      width: 100%;
      color: var(--fg2);
    }

    &:hover {
      opacity: 1;
    }
  }
}

.sphere {
  position: absolute;
  opacity: 0.5;
  z-index: 1;

  top: 20vh;
  height: 70vh;

  right: -33vw;
  width: 100%;

  display: flex;
  overflow: visible;
  :deep(img) {
    position: absolute;
    left: 0;
    top: 0;
    height: auto;
    width: 100%;
    object-fit: cover;
    object-position: top;
  }
  @media (orientation: portrait) and (max-width: 70rem) {
    width: 150vw;
    left: -25vw;
    bottom: 0;
    opacity: 0.25;
    height: 20rem;
  }
}
</style>
