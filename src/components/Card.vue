<script setup>
import Button from "./Button.vue";
import { ref, defineProps, defineEmits, watch } from "vue";

const props = defineProps({
  cards: Array, // Expecting multiple cards
});

const emit = defineEmits();

// Bingo grid columns
const columns = ["b", "i", "n", "g", "o"];

// Map of called numbers per card (key = card.id, value = array)
const calledMap = ref({});

// Initialize empty called arrays per card
console.log(props.cards);
watch(
  () => props.cards,
  (newCards) => {
    if (Array.isArray(newCards)) {
      newCards.forEach((card) => {
        if (!calledMap.value[card.id]) {
          calledMap.value[card.id] = [];
        }
      });
    }
  },
  { immediate: true, deep: true } // immediate runs it on mount
);

// Get value from card object
function getNumber(card, row, col) {
  const key = `${columns[col]}${row + 1}`;
  const val = card[key];
  return val === null ? "★" : val;
}

// Handle selection toggle
const handle_select = (cardId, number) => {
  const called = calledMap.value[cardId];

  const index = called.indexOf(number);
  if (index !== -1) {
    called.splice(index, 1);
  } else {
    called.push(number);
  }
};
</script>

<template>
  <div class="grid gap-2">
    <div
      v-for="card in cards"
      :key="card.id"
      class="shadow-xl shadow-gray-500 rounded-xl p-2"
    >
      <div class="text-xl font-bold text-center text-white">#{{ card.id }}</div>

      <!-- BINGO headers -->
      <div
        class="grid grid-cols-5 gap-1 text-center font-bold text-white mb-1 h-8 w-90"
      >
        <div
          class="rounded-full py-1"
          :class="
            h === 'B'
              ? 'bg-gray-800'
              : h === 'I'
              ? 'bg-orange-400'
              : h === 'N'
              ? 'bg-red-500'
              : h === 'G'
              ? 'bg-green-500'
              : h === 'O'
              ? 'bg-red-400'
              : ''
          "
          v-for="h in ['B', 'I', 'N', 'G', 'O']"
          :key="h"
        >
          {{ h }}
        </div>
      </div>

      <!-- Bingo number grid -->
      <div class="grid grid-cols-5 gap-1 text-center">
        <div v-for="row in 5" :key="row" class="contents">
          <div
            v-for="col in 5"
            :key="col"
            :class="[
              'p-1 rounded text-black',
              calledMap[card.id]?.includes(getNumber(card, row - 1, col - 1))
                ? 'bg-blue-600 text-white'
                : 'bg-white',
            ]"
            @click="handle_select(card.id, getNumber(card, row - 1, col - 1))"
          >
            {{ getNumber(card, row - 1, col - 1) }}
          </div>
        </div>
      </div>

      <Button
        :text="card.is_blocked ? 'Blocked' : 'Bingo'"
        :styleClass="`${
          card.is_blocked ? 'bg-opacity-50 bg-red-500' : 'bg-yellow-500'
        }  w-full mt-2 py-1 mx-auto`"
        @click="$emit('bingo', card.id)"
      />
    </div>
  </div>
</template>
