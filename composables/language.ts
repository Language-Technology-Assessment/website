export const useLanguage = () => {
  const route = useRoute();
  const { locale } = useI18n();
  const languageCode = computed(() => {
    return locale.value === "en" ? "" : locale.value;
  });
  const markdownPath = computed(() => {
    // disabled
    return route.path;
    // const pad = route.path === '/' ? '/index' : route.path
    // return languageCode.value ? pad + '.' + languageCode.value : route.path
  });
  return {
    markdownPath,
  };
};
