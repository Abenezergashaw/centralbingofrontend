<script setup>
import { defineProps, defineEmits } from "vue";
import Button from "./Button.vue";
const props = defineProps({
  win_cards: Array,
  username: String,
});

const emit = defineEmits();

// Map columns
const columns = ["b", "i", "n", "g", "o"];

// function getNumber(row, col, index) {
//   const key = `${columns[col]}${row + 1}`;
//   const val = props.win_cards[index].card[key];
//   return val === null ? "★" : val;
// }

function getNumber(row, col, index) {
  // console.log("Hey: ", props.win_cards);

  const key = `${columns[col]}${row + 1}`;
  const val = props.win_cards[index].card[key];
  return val === null ? "★" : Number(val);
}
</script>

<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-gray-800 bg-opacity-98 z-50 overflow-y-auto">
      <div
        :class="`bg-gradient-to-b ${
          username == win_cards[0].user_id
            ? 'from-blue-800 via-blue-500 to-blue-800'
            : 'from-red-800 via-red-500 to-red-800'
        }  bg-opacity-15 w-[90%] max-h-screen mx-auto my-6 p-6 rounded-lg overflow-y-auto`"
      >
        <div class="text-6xl text-center mb-4">
          {{ username == win_cards[0].user_id ? "🏆" : "😭" }}
        </div>
        <div
          class="text-4xl text-center mb-4 text-red-900 font-bold tracking-widest"
        >
          You {{ username == win_cards[0].user_id ? "Won" : "Lost" }}
        </div>
        <div
          v-for="(win_card, index) in win_cards"
          :key="index"
          class="w-[90%] sm:w-[60%] mx-auto mb-2 opacity-80 p-4 rounded-lg shadow-lg"
        >
          <div class="text-lg font-bold text-center text-white mb-2 gap-2">
            <div class="text-white text-xl tracking-widest">
              🏆 {{ win_card.name }} Won!! 🏆
            </div>
            <div class="text-white text-xl">Card #{{ win_card.card.id }}</div>
          </div>

          <!-- Header Row -->
          <div
            class="grid grid-cols-5 gap-1 text-center font-bold text-white text-lg mb-2"
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

          <!-- Bingo numbers -->
          <div class="grid grid-cols-5 gap-1 text-center">
            <div v-for="(row, rowIndex) in 5" :key="rowIndex" class="contents">
              <div
                v-for="(col, colIndex) in 5"
                :key="colIndex"
                :class="[
                  'aspect-square', // Makes it a square
                  'w-full', // Take full width in grid cell
                  'rounded-2xl',
                  'border-4',
                  'text-sm sm:text-xl font-semibold flex items-center justify-center',
                  getNumber(rowIndex, colIndex, index) === '★'
                    ? 'bg-teal-200 text-black'
                    : win_card.current_number ===
                      getNumber(rowIndex, colIndex, index)
                    ? 'bg-green-700 border-green-500'
                    : win_card.lines.includes(
                        getNumber(rowIndex, colIndex, index)
                      )
                    ? 'border-green-500 bg-green-700'
                    : 'border-white bg-white text-black',
                ]"
              >
                {{ getNumber(rowIndex, colIndex, index) }}
              </div>
            </div>
          </div>
          <Button
            v-if="index === 0"
            text="Play Again"
            styleClass="bg-blue-800 w-full mt-4 border border-white text-white"
            @click="$emit('continue')"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
