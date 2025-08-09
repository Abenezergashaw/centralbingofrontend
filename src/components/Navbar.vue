<script setup>
import { ref, defineEmits } from "vue";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  GlobeAltIcon,
} from "@heroicons/vue/24/outline";

defineProps(["modelValue"]);
const emit = defineEmits(["update:modelValue", "selected-menu"]);

const menuItems = [
  { label: "Home", icon: HomeIcon, value: "home" },
  { label: "Bingo Game", icon: ChartBarIcon, value: "game" },
  { label: "Game History", icon: ClockIcon, value: "history" },
  { label: "Wallet", icon: CurrencyDollarIcon, value: "wallet" },
  { label: "Leaderboard", icon: TrophyIcon, value: "leaderboard" },
  { label: "How To Play", icon: QuestionMarkCircleIcon, value: "howto" },
  { label: "Referral Income", icon: UsersIcon, value: "referral" },
  { label: "Language", icon: GlobeAltIcon, value: "language" },
];

const selected = ref("home");

function selectMenu() {
  emit("selected-menu", selected.value);
}
</script>
<!-- components/NavDrawer.vue -->
<template>
  <div
    v-if="modelValue"
    class="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
    @click="$emit('update:modelValue', false)"
  ></div>

  <!-- Drawer -->
  <div
    class="fixed top-0 left-0 h-full bg-white dark:bg-gray-800 z-50 transition-transform duration-300 ease-in-out md:hidden"
    :class="modelValue ? 'translate-x-0' : '-translate-x-full'"
    style="width: 300px"
  >
    <div
      class="p-4 flex justify-between items-center border-b dark:border-gray-700"
    >
      <h2 class="text-xl font-bold text-gray-800 dark:text-white">Menu</h2>
      <button
        @click="$emit('update:modelValue', false)"
        class="text-gray-600 dark:text-gray-300 text-2xl"
      >
        &times;
      </button>
    </div>
    <div class="flex flex-col gap-2 text-gray-800 px-4 py-2">
      <div
        v-for="item in menuItems"
        :key="item.value"
        @click="
          selected = item.value;
          selectMenu();
        "
        class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
        :class="
          selected === item.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-50 hover:bg-blue-100'
        "
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>
