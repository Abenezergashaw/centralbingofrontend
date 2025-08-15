import { defineStore } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { watchEffect } from "vue";

export const useMenuStore = defineStore("menu", {
  state: () => ({
    selected: null,
  }),
  actions: {
    init() {
      const route = useRoute();

      watchEffect(() => {
        const path = route.path.replace(/^\//, ""); // remove leading slash

        if (path === "bingo") {
          this.selected = "game";
        } else if (path === "howtoplay") {
          this.selected = "howto";
        } else if (path === "history") {
          this.selected = "history";
        } else if (path === "wallet") {
          this.selected = "wallet";
        } else if (path === "leaderboard") {
          this.selected = "leaderboard";
        } else {
          this.selected = path;
        }
      });
    },
    setSelected(s) {
      this.selected = s;
    },
  },
});
