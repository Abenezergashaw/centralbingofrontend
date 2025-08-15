import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: "934596919",
    id: null,
    name: null,
    real_balance: 0,
    bonus_balance: 0,
  }),
  actions: {
    setUser(a) {
      this.user = a;
    },
    setUserBalance(r, b) {
      this.real_balance = r;
      this.bonus_balance = b;
    },
    setName(a) {
      this.name = a;
    },
  },
});
