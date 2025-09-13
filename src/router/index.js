import Admin from "@/views/Admin.vue";
import Bingo from "@/views/Bingo.vue";
import History from "@/views/History.vue";
import Home from "@/views/Home.vue";
import HowToPlay from "@/views/HowToPlay.vue";
import Leaderboard from "@/views/Leaderboard.vue";
import Profile from "@/views/Profile.vue";
import Refferals from "@/views/Refferals.vue";
import Wallet from "@/views/Wallet.vue";
import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/bingo",
      name: "bingo",
      component: Bingo,
    },
    {
      path: "/howtoplay",
      name: "howtoplay",
      component: HowToPlay,
    },
    {
      path: "/leaderboard",
      name: "leaderboard",
      component: Leaderboard,
    },
    {
      path: "/history",
      name: "history",
      component: History,
    },
    {
      path: "/wallet",
      name: "wallet",
      component: Wallet,
    },
    {
      path: "/profile",
      name: "profile",
      component: Profile,
    },
    {
      path: "/referrals",
      name: "referrals",
      component: Refferals,
    },
    {
      path: "/admin",
      name: "admin",
      component: Admin,
    },
  ],
});

export default router;
