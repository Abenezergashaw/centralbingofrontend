<script setup>
import { ref, defineEmits, onMounted, computed } from "vue";
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ClockIcon,
  TrophyIcon,
  QuestionMarkCircleIcon,
  UsersIcon,
  GlobeAltIcon,
  UserIcon,
  UserCircleIcon,
  ChevronLeftIcon,
  CogIcon,
  AcademicCapIcon,
} from "@heroicons/vue/24/outline";
import { useMenuStore } from "@/stores/menu";
import { useUserStore } from "@/stores/user";

// Pinia stores
const menu = useMenuStore();
const user = useUserStore();

defineProps(["modelValue", "bg"]);
const emit = defineEmits(["update:modelValue", "selected-menu"]);

const menuItems = [
  { label: "Home", icon: HomeIcon, value: "home" },
  { label: "Bingo Game", icon: ChartBarIcon, value: "game" },
  { label: "Game History", icon: ClockIcon, value: "history" },
  { label: "Wallet", icon: CurrencyDollarIcon, value: "wallet" },
  { label: "Leaderboard", icon: TrophyIcon, value: "leaderboard" },
  { label: "How To Play", icon: QuestionMarkCircleIcon, value: "howto" },
  { label: "Referral Income", icon: UsersIcon, value: "referrals" },
  { label: "Language", icon: GlobeAltIcon, value: "language" },
];

const SettingItems = [
  { label: "Profile", icon: CogIcon, value: "profile" },
  { label: "Contact", icon: QuestionMarkCircleIcon, value: "contact" },
  { label: "Admin", icon: AcademicCapIcon, value: "admin" },
];

const visibleItems = computed(() =>
  SettingItems.filter(
    (item) => item.value !== "admin" || user.user === "918159201"
  )
);

const selected = ref(null);
onMounted(() => {});

function selectMenu() {
  menu.setSelected(selected.value);
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
      class="flex items-center gap-2 relative h-32 px-6 mb-2 tracking-widest"
    >
      <UserCircleIcon class="w-16 h-16 text-black" />
      <div>
        <h2 class="text-lg font-bold text-gray-800 dark:text-white">
          Hey, Player
        </h2>
        <h2 class="text-sm font-lg text-gray-800 dark:text-white">
          {{ user.name }}
        </h2>
      </div>

      <ChevronLeftIcon
        class="w-8 h-8 text-blue-700 absolute top-5 right-4"
        @click="$emit('update:modelValue', false)"
      />
    </div>
    <hr class="border-b mb-2 border-gray-400 w-[90%] mx-auto" />
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
          menu.selected === item.value
            ? 'bg-blue-500 text-white'
            : 'bg-gray-50 hover:bg-blue-100'
        "
      >
        <component :is="item.icon" class="w-5 h-5" />
        <span class="font-medium">{{ item.label }}</span>
      </div>
    </div>
    <hr class="border-b mb-2 border-gray-400 w-[90%] mx-auto my-6" />

    <div class="flex flex-col gap-2 text-gray-800 px-4 py-2">
      <div
        v-for="item in visibleItems"
        :key="item.value"
        @click="
          selected = item.value;
          selectMenu();
        "
        class="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors"
        :class="
          menu.selected === item.value
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
