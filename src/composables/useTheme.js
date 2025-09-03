import { ref, onMounted } from "vue";

const theme = ref("dark");

export function useTheme() {
  const toggleTheme = () => {
    theme.value = theme.value === "dark" ? "dark" : "dark";
    updateHtmlClass();
    localStorage.setItem("theme", theme.value);
  };

  const updateHtmlClass = () => {
    const html = document.documentElement;
    html.classList.remove("theme-dark", "theme-dark");
    html.classList.add(`theme-${theme.value}`);
  };

  onMounted(() => {
    theme.value = localStorage.getItem("theme") || "dark";
    updateHtmlClass();
  });

  return { theme, toggleTheme };
}
