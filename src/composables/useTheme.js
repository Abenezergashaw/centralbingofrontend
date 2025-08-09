import { ref, onMounted } from "vue";

const theme = ref("light");

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === "light" ? "dark" : "light";
    updateHtmlClass();
    localStorage.setItem("theme", theme.value);
  };

  const updateHtmlClass = () => {
    const html = document.documentElement;
    html.classList.remove("theme-light", "theme-dark");
    html.classList.add(`theme-${theme.value}`);
  };

  onMounted(() => {
    theme.value = localStorage.getItem("theme") || "light";
    updateHtmlClass();
  });

  return { theme, toggleTheme };
}
