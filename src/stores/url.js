import { defineStore } from "pinia";

export const useUrl = defineStore("user", {
  state: () => ({
    url: "https://centralbingo.duckdns.org",
  }),
});
