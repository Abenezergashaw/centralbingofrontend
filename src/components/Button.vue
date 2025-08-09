<script setup>
import { defineProps } from "vue";

defineProps({
  text: String,
  styleClass: {
    type: String,
    default: "bg-yellow-500",
  },
});
</script>

<template>
  <div
    :class="`w-[80%]  rounded-lg py-3 ${styleClass} text-center text-xl font-semibold`"
  >
    {{ text }}
  </div>
</template>
