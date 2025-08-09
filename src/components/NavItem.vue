<!-- components/NavItem.vue -->
<template>
  <router-link
    v-if="to"
    :to="to"
    class="flex items-center p-3 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
    active-class="bg-teal-50 dark:bg-gray-700"
  >
    <component
      :is="getIconComponent"
      class="w-5 h-5 mr-3 text-teal-600 dark:text-teal-400"
    />
    <span class="text-gray-700 dark:text-gray-200">{{ text }}</span>
  </router-link>
  <div
    v-else
    @click="$emit('click')"
    class="flex items-center p-3 rounded-lg hover:bg-teal-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
  >
    <component
      :is="getIconComponent"
      class="w-5 h-5 mr-3 text-teal-600 dark:text-teal-400"
    />
    <span class="text-gray-700 dark:text-gray-200">{{ text }}</span>
  </div>
</template>

<script setup>
import { defineProps, computed } from "vue";
import {
  HomeIcon,
  TicketIcon,
  ClockIcon,
  WalletIcon,
  ChartBarIcon,
  QuestionMarkCircleIcon,
  UserGroupIcon,
  LanguageIcon,
  ArrowLeftOnRectangleIcon,
} from "@heroicons/vue/24/outline";

const props = defineProps({
  icon: String,
  text: String,
  to: String,
});

const getIconComponent = computed(() => {
  switch (props.icon) {
    case "home":
      return HomeIcon;
    case "bingo":
      return TicketIcon;
    case "history":
      return ClockIcon;
    case "wallet":
      return WalletIcon;
    case "leaderboard":
      return ChartBarIcon;
    case "help":
      return QuestionMarkCircleIcon;
    case "referral":
      return UserGroupIcon;
    case "language":
      return LanguageIcon;
    case "logout":
      return ArrowLeftOnRectangleIcon;
    default:
      return HomeIcon;
  }
});
</script>
