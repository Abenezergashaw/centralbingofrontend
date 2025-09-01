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

const loading = ref(true);

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

async function getTelegramId(retries = 5, delay = 500) {
  for (let i = 0; i < retries; i++) {
    const tg = window.Telegram?.WebApp;

    const id = tg.initDataUnsafe?.user?.id;
    if (id) {
      return id; // ✅ got it
    }

    // wait before retrying
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  throw new Error("Unable to fetch Telegram ID after retries");
}

menu.init();
onMounted(async () => {
  preloadAllAudios();

  // const id = tg.initDataUnsafe?.user.id;
  let id = null;
  (async () => {
    try {
      id = await getTelegramId();
      // id = "353008986";

      console.log("aaa ID:", id);

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
        if (b !== NaN) {
          loading.value = false;
        }
      }
    } catch (err) {
      console.error(err.message);
    }
  })();
  // console.log("tg", tg);
});
</script>

<template>
  <div
    v-if="loading"
    class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20"
  >
    <!-- Modal Box -->
    <div class="">
      <div
        class="w-14 h-14 rounded-full border-[6px] animate-spin"
        :style="{
          borderColor: 'var(--nav-bar2)',
          borderTopColor: 'var(--nav-bar1)',
        }"
      ></div>
    </div>
  </div>

  <InfoNavbar :balance="user.real_balance + user.bonus_balance" />
  <div>
    <!-- Navbar -->
    <header
      class="flex items-center justify-between px-4 text-white md:w-[98%] my-2 md:rounded-lg mx-auto"
      :style="{ backgroundColor: 'var(--nav-bar2)' }"
    >
      <button @click="drawerOpen = true" class="text-[42px] md:hidden">
        ☰
      </button>
      <div class="hidden md:block" @click="gotoHome">
        <img src="./assets/logo.png" class="h-20 w-32" alt="" />
      </div>
      <div class="hidden md:flex gap-4 text-sm items-center">
        <div v-for="item in menuItems">{{ item.label }}</div>
      </div>
      <div class="md:hidden border" @click="gotoHome">
        <img src="./assets/logo.png" class="h-24 aspect-square" alt="" />
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
