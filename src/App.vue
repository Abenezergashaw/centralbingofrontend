<script setup>
import { onMounted, ref, watch } from "vue";
import { RouterView, useRouter, useRoute } from "vue-router";
import InfoNavbar from "./components/InfoNavbar.vue";
import Navbar from "./components/Navbar.vue";
import { useBalance } from "./composables/useBalance";
import { useUserStore } from "./stores/user";
import { useMenuStore } from "./stores/menu";
import {
  preloadAllAudios,
  unlockAudio,
  playCachedAudio,
} from "@/composables/useAudioManager";
import axios from "axios";
import { useUrl } from "./stores/url";

// Composable functions
const { get_balance, get_both_balance } = useBalance();

// Pinia stores
const user = useUserStore();
const menu = useMenuStore();
const url = useUrl();

const router = useRouter();
const route = useRoute();
// General username
const username = ref(user.user);
// const balance = ref(user.balance);

const drawerOpen = ref(false);

const menuItems = [
  { label: "Home" },
  { label: "Contact" },
  { label: "Leaderboard" },
  { label: "How To Play" },
  { label: "Referral Income" },
];

const handleSelectedMenu = (d) => {
  drawerOpen.value = false;
  menu.setSelected(d);
  if (d === "home") {
    router.push(`/`);
  }
  if (d === "game") {
    router.push(`/bingo`);
  }
  if (d === "howto") {
    router.push(`/howtoplay`);
  }
  if (d === "leaderboard") {
    router.push(`/leaderboard`);
  }

  if (d === "history") {
    router.push(`/history`);
  }
  if (d === "wallet") {
    router.push(`/wallet`);
  }
  if (d === "profile") {
    router.push(`/profile`);
  }
  if (d === "referrals") {
    router.push(`/referrals`);
  }
};

const gotoHome = () => {
  menu.setSelected("home");
  router.push(`/`);
};

menu.init();
onMounted(async () => {
  preloadAllAudios();

  const tg = window.Telegram?.WebApp;

  const id = tg.initDataUnsafe?.user.id;
  // const id = "353008986";
  // console.log("tg", tg);

  user.setId(id);

  console.log("Telegram ID: ", id);

  let phone = null;

  const res = await axios.get(`${url.url}/api/general/get_user`, {
    params: { telegram_id: id },
  });
  console.log("UseUser:", id);

  if (res.data.status) {
    console.log("UseUser phone:", res.data.phone);
    phone = res.data.phone;
    // return res.data.phone;
  } else {
    // return 0; // User found, but has no data? (unlikely)
  }

  user.setUser(phone);
  const b = await get_both_balance(phone);
  user.setUserBalance(b.balance, b.bonus);

  console.log("Balance", b);

  const a = await axios.get(`${url.url}/api/general/get_name`, {
    params: { phone },
  });

  if (a.data.status) {
    console.log(a.data.data[0].name);
    user.setName(a.data.data[0].name);
  }
});
</script>

<template>
  <InfoNavbar :balance="user.real_balance + user.bonus_balance" />
  <div>
    <!-- Navbar -->
    <header
      class="flex items-center justify-between px-4 text-white md:w-[98%] my-2 md:rounded-lg mx-auto"
      :style="{ backgroundColor: 'var(--nav-bar2)' }"
    >
      <button @click="drawerOpen = true" class="text-2xl md:hidden">☰</button>
      <div class="hidden md:block" @click="gotoHome">
        <img src="./assets/logo.png" class="h-20 w-32" alt="" />
      </div>
      <div class="hidden md:flex gap-4 text-sm items-center">
        <div v-for="item in menuItems">{{ item.label }}</div>
      </div>
      <div class="md:hidden" @click="gotoHome">
        <img src="./assets/logo.png" class="h-20 w-32" alt="" />
      </div>
      <div class="hidden md:flex" @click="gotoHome">
        <div class="h-20 w-32" alt=""></div>
      </div>
    </header>

    <!-- Sliding Drawer -->
    <Navbar
      v-model="drawerOpen"
      :bg="menu.selected"
      @selected-menu="handleSelectedMenu"
    />
  </div>

  <RouterView />
</template>
