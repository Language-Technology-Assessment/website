<template>
  <div class="mainmenu" ref="menuelement" :class="{ active, afteractive, menuopen }">
    <!-- mobile button -->
    <button class="menubutton" @click="menuopen = !menuopen" :class="{ open: menuopen }">
      <Icon icon="ic:round-menu" v-if="!menuopen"></Icon>
      <Icon icon="ic:round-close" v-if="menuopen"></Icon>
    </button>
    <!-- mobile logo -->
    <NuxtLink to="/" class="mobile-logo-link">
      <logoname class="mobile-logoname"></logoname>
    </NuxtLink>
    <!-- content -->
    <div class="frame" @click="menuopen = false">
      <div class='left'>
        <NuxtLink :to="item.link" v-for="item in menu.left" :target="item.target"
          :class="{ withIcon: !!item.icon, exact: $route.fullPath === item.link }">
          <span v-if="item.name">{{ item.name }}</span>
          <Icon :icon="item.icon" v-if="item.icon"></Icon>
        </NuxtLink>
      </div>
      <div class="mid">
        <NuxtLink to="/">
          <logo class="logo" />
          <logoname class="logoname"></logoname>
        </NuxtLink>
      </div>
      <div class='right'>
        <NuxtLink :to="item.link" v-for="item in menu.right" :target="item.target"
          :class="{ withIcon: !!item.icon, exact: $route.fullPath === item.link }">
          <span v-if="item.name">{{ item.name }}</span>
          <Icon :icon="item.icon" v-if="item.icon"></Icon>
        </NuxtLink>
        <button class="darkmode" @click.stop="toggleDark()">
          <Icon class="light-icon" icon="ic:baseline-light-mode"></Icon>
          <Icon class="dark-icon" icon="ic:round-dark-mode"></Icon>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useDark, useToggle } from '@vueuse/core'
import logo from '@/repos/website/images/logo.svg?component'
import logoname from '@/repos/website/images/logo2-name-c.svg?component';
import { Icon } from '@iconify/vue'
import menu from '@/repos/website/menu.yml'
const menuopen = ref(false)
const active = ref(false)
const afteractive = ref(false)
const isDark = useDark()
const toggleDark = useToggle(isDark)
onMounted(() => {
  setTimeout(() => { active.value = true }, 0)
  setTimeout(() => { afteractive.value = true }, 2500)
})
const { locale, setLocale } = useI18n()
watch(menuopen, (val) => {
  if (val) {
    document.body.classList.add('scroll-block')
  } else {
    document.body.classList.remove('scroll-block')
  }
})
</script>

<style lang="less" scoped>
.mainmenu {
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 99;
  padding-top: 3rem;
  padding-bottom: 3rem;
  transition: all 3s ease;
  opacity: 0;

  &.active {
    transition: all 2s ease;
    opacity: 1;
  }

  &.afteractive {
    transition: all 0.2s ease !important;
  }

  .top & {
    transition-delay: 0s;
  }

  .nottop & {
    transition: all 0.2s ease !important;
    padding-top: 1rem;
    padding-bottom: 1rem;
    background: var(--bg);
  }

  .scroll-down.nottop & {
    transform: translateY(-.5rem);
    opacity: 0;
    pointer-events: none;
  }

  .scroll-up & {}

  .scroll-up.nottop & {
    transform: translateY(0);
    background: var(--bg);
    box-shadow: 0 0 .25rem var(--shadow);
  }

  .frame {
    display: flex;
    .row();
  }

  .left {
    flex: 1;
  }
}

.left,
.right {
  display: flex;
  align-items: center;
  gap: 0;
}

.mobile-logo-link {
  display: none;
}

.mid {
  position: absolute;
  top: 3rem;
  width: 10rem;
  left: calc(50% - 5rem);
  text-align: center;
  font-size: 2rem;
  transition: all 1s @easeInOutExpo;

  .logo,
  .logoname {
    transition: all 1s @easeInOutExpo;
  }

  .logo {
    width: 2rem;
    height: 2rem;
    opacity: 0;
  }

  .logoname {
    position: absolute;
    top: .25rem;
    width: 4rem;
    height: auto;
    left: calc(50% - 2rem);
    transition-delay: 0.1s;

    :deep(path) {
      fill: var(--fg);
      transition: all 0.15s ease;
    }

    :root[path="/"] & {
      top: 4rem;
      width: 10rem;
      left: calc(50% - 5rem);

      :deep(path) {
        fill: var(--fg);
      }
    }

    &:hover {
      :deep(path) {
        fill: var(--link);
      }
    }
  }

  .nottop & {
    top: .25rem;

    .logo {
      width: 1.5rem;
      height: 1.5rem;
      opacity: 1;
      transition-delay: 0.3s;

      :deep(path) {
        fill: var(--fg2);
      }
    }

    .logoname {
      opacity: 0;
      pointer-events: none;
      transition-delay: 0s;
      transform: translateY(-3rem);
    }
  }
}

.left {
  a {
    margin-right: 3rem;

    &.haslogo {
      margin-right: 2rem;
    }
  }
}

.right {
  a {
    margin-left: 3rem;
  }

  button {
    margin-left: 2rem !important;
  }
}

button.menubutton {
  position: fixed;
  top: 0;
  right: 0;
  display: none;
}

button.darkmode {
  border-radius: 0.75em;
  background: var(--bg3);
  position: relative;
  margin: 0;
  height: 1.25em;
  width: 2.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;

  .dark-icon {
    opacity: 0;
  }

  .light-icon {
    opacity: 1;
  }

  :deep(svg) {
    position: relative;
    z-index: 2;
    color: var(--bg);
  }

  &:after {
    content: "";
    width: calc(100% - 1em);
    height: 100%;
    background: var(--fg);
    border-radius: inherit;
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(0rem);
    transition: all 2.5s ease;

    .dark & {
      transform: translateX(1em);
    }
  }

  :root.dark & {
    .dark-icon {
      opacity: 1;
    }

    .light-icon {
      opacity: 0;
    }


  }
}

a {
  text-decoration: none;
  line-height: 1;
  color: var(--fg);

  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.75rem;

  &.exact {
    color: var(--link);
  }

  &.router-link-active {
    // text-decoration: underline;
  }

  &.withIcon {
    font-size: 1.125rem;
  }

  &:not(.withIcon) {
    padding-bottom: 0.2em;
  }

  &:hover {
    text-decoration: underline;
  }
}

.logo {

  :deep(path) {
    fill: var(--fg);
  }

  &:hover {
    :deep(path) {
      fill: var(--link);
    }
  }
}

@media (max-width: 60rem) {

  button.menubutton {
    position: fixed;
    display: block;
    margin: 1.5rem 1.5rem;
    border-radius: 0.5rem;
    padding: 0;
    color: var(--fg);
    background: transparent;
    // border: 1px solid var(--bc);
    z-index: 99;
    font-size: 2rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    pointer-events: auto;
    line-height: 1;

    :deep(svg) {
      margin: 0;
    }

    &.open {}

    &:hover {
      color: var(--link);
    }
  }

  a.mobile-logo-link {
    display: block;
    position: absolute;
    top: 4rem;
    left: 0;
    opacity: 1 !important;
    width: 100%;
    z-index: 99;
    transform: none !important;
    pointer-events: auto;

    .mobile-logoname {
      width: 5rem;
      height: auto;
      margin: 0 auto;
      margin-top: 1rem;
      display: block;

      :deep(path) {
        fill: var(--fg);
      }

      :root[path="/"] & {
        margin-top: 2rem;
        width: 12rem;

        :deep(path) {
          fill: var(--fg);
        }
      }

      .menuopen & {
        :root[path="/"] & {
          width: 6rem !important;
        }
      }
    }

    .nottop & {
      opacity: 0 !important;
      pointer-events: none;
      transition: all 0.1s;
    }

    .menuopen & {
      transform: none !important;

      .nottop & {
        opacity: 1 !important;
        pointer-events: auto;
      }
    }
  }

  .mainmenu {
    pointer-events: none;

    .scroll-up.nottop & {
      background: transparent;
      box-shadow: none;
    }
  }

  .mainmenu .frame {
    opacity: 0;
    pointer-events: none;
  }

  .mainmenu a {
    transform: translateY(2rem);
    opacity: 0;
    transition: all 1s @easeInOutExpo;
    font-size: 1rem;
    display: block;
    margin: 0 0 2rem;
  }

  .mainmenu.menuopen {
    opacity: 1 !important;
    left: 0;
    padding: 0;

    .frame {
      position: fixed;
      display: block;
      top: 0;
      left: 0;
      width: 100%;
      max-width: 100%;
      height: 100vh;
      padding: 16rem 1.5rem 1.5rem;
      background: var(--bg);
      overflow: auto;
      opacity: 1;
      pointer-events: auto;

      .left,
      .right {
        display: block;

        a {
          margin: 0 0 2rem;
          text-align: center;
        }
      }

      .mid {
        display: none;
      }
    }
  }

  .mainmenu a {
    &[href="/"] {
      // display: none !important;
    }

  }

  .mainmenu.menuopen a {
    opacity: 1;
    transform: translateX(0);
  }

  button.darkmode {
    position: fixed;
    top: 2rem;
    margin: 0;
    margin-left: 0 !important;
  }
}
</style>