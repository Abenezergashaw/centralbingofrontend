import { defineStore } from "pinia";

export const useUrl = defineStore("url", {
  state: () => ({
    url: "https://centralbingo.duckdns.org",
  }),
});
