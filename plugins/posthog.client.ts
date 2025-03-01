import { defineNuxtPlugin } from "#app";
import posthog from "posthog-js";
export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig();
  if (runtimeConfig.public.NUXT_SITE_ENV === "preview") {
    return;
  }
  const posthogClient = posthog.init(runtimeConfig.public.posthogPublicKey, {
    api_host: runtimeConfig.public.posthogHost,
    person_profiles: "identified_only", // or 'always' to create profiles for anonymous users as well
    capture_pageview: false, // we add manual pageview capturing below
    persistence: "memory",
    loaded: (posthog) => {
      if (import.meta.env.NUXT_SITE_ENV === "preview") posthog.debug();
    },
  });

  // Make sure that pageviews are captured with each route change
  const router = useRouter();
  router.afterEach((to, from) => {
    nextTick(() => {
      if (from.fullPath !== to.fullPath) {
        posthog.capture("$pageleave", {
          current_url: from.fullPath,
        });
      }

      posthog.capture("$pageview", {
        current_url: to.fullPath,
      });
    });
  });

  return {
    provide: {
      posthog: () => posthogClient,
    },
  };
});
