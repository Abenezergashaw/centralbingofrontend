<script setup>
import { ref } from "vue";
import { useTheme } from "../composables/useTheme";
import { useRouter } from "vue-router";

const { theme, toggleTheme } = useTheme();

const router = useRouter();

const isOn = ref(false);

defineProps({
  balance: Number,
});

const toggle = () => {
  isOn.value = !isOn.value;
  toggleTheme();
};

const gotoHowto = () => {
  router.push("/howtoplay");
};

const gotoWallet = () => {
  router.push("/wallet");
};
</script>

<template>
  <div
    class="w-full flex justify-between items-center px-4 py-1.5"
    style="background-color: var(--nav-bar1)"
  >
    <div class="w-12 h-12 flex justify-center items-center" @click="gotoHowto">
      <svg
        stroke="currentColor"
        fill="#FFC107"
        stroke-width="0"
        viewBox="0 0 512 512"
        class="text-warning"
        height="30"
        width="30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"
        ></path>
      </svg>
    </div>

    <div class="flex items-center gap-4">
      <button
        @click="toggle"
        :class="[
          'shadow-sm shadow-white w-20 h-8 flex items-center rounded-full p-1 transition-colors duration-300',
        ]"
        style="background-color: var(--toggle-bg)"
      >
        <div
          :class="[
            'bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300',
            isOn ? 'translate-x-2' : 'translate-x-10',
          ]"
          style="background-color: var(--toggle-btn)"
        ></div>
      </button>

      <div
        class="px-8 py-2 rounded-3xl font-semibold flex justify-around items-center gap-2"
        @click="gotoWallet"
        :style="{ backgroundColor: 'var(--button-color)' }"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M95.5 104h320a87.73 87.73 0 0 1 11.18.71 66 66 0 0 0-77.51-55.56L86 94.08h-.3a66 66 0 0 0-41.07 26.13A87.57 87.57 0 0 1 95.5 104zm320 24h-320a64.07 64.07 0 0 0-64 64v192a64.07 64.07 0 0 0 64 64h320a64.07 64.07 0 0 0 64-64V192a64.07 64.07 0 0 0-64-64zM368 320a32 32 0 1 1 32-32 32 32 0 0 1-32 32z"
          ></path>
          <path
            d="M32 259.5V160c0-21.67 12-58 53.65-65.87C121 87.5 156 87.5 156 87.5s23 16 4 16-18.5 24.5 0 24.5 0 23.5 0 23.5L85.5 236z"
          ></path>
        </svg>
        ETB {{ balance }}
      </div>
    </div>
  </div>
</template>
