import { defineStore } from "pinia";

export const useUrl = defineStore("url", {
  state: () => ({
    // url: "https://centralbingo.duckdns.org",
    // url: "http://localhost:3001",
    url: "https://axum.gondarmenu.com",
  }),
});
