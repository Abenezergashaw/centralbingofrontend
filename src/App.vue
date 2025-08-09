<script setup>
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";
import InfoNavbar from "./components/InfoNavbar.vue";
import Navbar from "./components/Navbar.vue";
import { useBalance } from "./composables/useBalance";

// Composable functions
const { get_balance } = useBalance();

const router = useRouter();

// General username
const username = ref("934596919");
const balance = ref(0);

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
};

onMounted(async () => {
  balance.value = await get_balance(username.value);
  console.log("Balance", username.value, balance.value);
});
</script>

<template>
  <InfoNavbar :balance="balance" />
  <div>
    <!-- Navbar -->
    <header
      class="flex items-center justify-between p-4 text-white md:w-[98%] my-2 md:rounded-lg mx-auto"
      :style="{ backgroundColor: 'var(--nav-bar2)' }"
    >
      <button @click="drawerOpen = true" class="text-2xl md:hidden">☰</button>
      <div class="hidden md:block">Central Bingo logo</div>
      <div class="hidden md:flex gap-4 text-sm items-center">
        <div v-for="item in menuItems">{{ item.label }}</div>
      </div>
      <h1 class="text-xl font-bold">My App</h1>
    </header>

    <!-- Sliding Drawer -->
    <Navbar v-model="drawerOpen" @selected-menu="handleSelectedMenu" />
  </div>

  <RouterView />
</template>
