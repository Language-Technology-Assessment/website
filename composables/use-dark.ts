const isDark = ref(false);

export const useDark = () => {
  const toggleDark = () => {
    isDark.value = !isDark.value;
  };

  onMounted(() => {
    const status = window.localStorage.getItem("color-mode");
    isDark.value = status !== "light";
    document.documentElement.classList.toggle("dark", isDark.value);
  });

  watch(isDark, (value) => {
    window.localStorage.setItem("color-mode", value ? "dark" : "light");
    document.documentElement.classList.toggle("dark", value);
  });

  return { isDark, toggleDark };
};
