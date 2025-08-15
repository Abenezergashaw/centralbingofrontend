import { defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", {
  state: () => ({
    loading: false,
  }),
  actions: {
    setLoading(state) {
      this.loading = state;
    },
  },
});
