import {useElementVisibility, useElementBounding, useWindowSize} from '@vueuse/core'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('visible', {
    mounted(el) {
      if (el) {
        const targetIsVisible = useElementVisibility(el)
        watch(targetIsVisible, (val) => {
          if (val) {
            el.classList.add('visible');
            el.classList.remove('invisible');
          } else {
            el.classList.remove('visible');
            el.classList.add('invisible');
          }
        })
      }
    }
  })
  nuxtApp.vueApp.directive('visiblecontainer', {
    mounted(el) {
      const {height} = useWindowSize()
      if (el) {
        const { top } = useElementBounding(el)
        watch(top, (t) => {
          if (t < height.value) {
            el.classList.add('visible-container');
            el.classList.remove('invisible-container');
          } else {
            el.classList.remove('visible-container');
            el.classList.add('invisible-container');
          }
        })
      }
    }
  })
})
