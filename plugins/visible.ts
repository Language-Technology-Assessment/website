import {
  useElementVisibility,
  useElementBounding,
  useIntersectionObserver,
  useWindowSize,
} from "@vueuse/core";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive("visible", {
    mounted(el) {
      if (el) {
        useIntersectionObserver(el, ([entry]) => {
          el.toggleAttribute("data-visible", entry?.isIntersecting ?? false);
        });
      }
      setTimeout(() => {
        useIntersectionObserver(el, ([entry]) => {
          el.toggleAttribute("data-visible", entry?.isIntersecting ?? false);
        });
      }, 0);
    },
  });
  nuxtApp.vueApp.directive("visiblecontainer", {
    mounted(el) {
      const { height } = useWindowSize();
      if (el) {
        const { top } = useElementBounding(el);
        watch(top, (t) => {
          if (t < height.value) {
            el.classList.add("visible-container");
            el.classList.remove("invisible-container");
          } else {
            el.classList.remove("visible-container");
            el.classList.add("invisible-container");
          }
        });
      }
    },
  });
});
