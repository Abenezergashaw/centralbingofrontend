<script setup>
const props = defineProps({
  cards: {
    type: Array,
    default: () => [],
  },
  confirmed: Boolean,
});

const emit = defineEmits();

const buildMatrix = (card) => {
  const columns = ["b", "i", "n", "g", "o"];
  const matrix = [];

  for (let row = 1; row <= 5; row++) {
    const rowData = [];
    for (const col of columns) {
      const key = `${col}${row}`;
      const value = card?.[key];
      rowData.push(value == null ? "★" : value);
    }
    matrix.push(rowData);
  }

  return matrix;
};
</script>

<template>
  <div
    class="flex flex-col items-center w-[100%] mx-auto gap-3 justify-center my-2 px-2"
  >
    <template v-if="Array.isArray(cards) && cards.length" class="flex flex-col">
      <div
        v-for="card in cards"
        :key="card?.id ?? Math.random()"
        class="border rounded overflow-hidden shadow text-white w-[55%] flex flex-col justify-center items-center"
      >
        <div class="text-center py-1 font-semibold text-white">
          Card No. {{ card?.id ?? "?" }}
        </div>

        <div
          class="grid grid-cols-5 gap-2 text-center font-bold text-white text-xs w-full mb-2"
        >
          <div
            v-for="letter in ['B', 'I', 'N', 'G', 'O']"
            :key="letter"
            class="rounded-full py-1"
            :class="
              letter === 'B'
                ? 'bg-gray-800'
                : letter === 'I'
                ? 'bg-orange-400'
                : letter === 'N'
                ? 'bg-red-500'
                : letter === 'G'
                ? 'bg-green-500'
                : letter === 'O'
                ? 'bg-red-400'
                : ''
            "
          >
            {{ letter }}
          </div>
        </div>

        <div class="grid grid-cols-5 gap-2 text-center text-sm w-full">
          <div
            v-for="(row, rowIndex) in buildMatrix(card)"
            :key="'row-' + rowIndex"
            class="contents"
          >
            <div
              v-for="(cell, colIndex) in row"
              :key="'cell-' + rowIndex + '-' + colIndex"
              class="w-9 h-9 flex items-center justify-center border font-medium bg-white text-black"
            >
              {{ cell }}
            </div>
          </div>
        </div>
      </div>
      <div
        class="my-2 flex justify-around items-center w-[100%]"
        @click="$emit('go_back')"
      >
        <button class="bg-yellow-500 px-4 py-2 rounded-lg text-lg">
          Go Back
        </button>
        <button
          class="bg-yellow-500 px-4 py-2 rounded-lg text-lg"
          @click="$emit('confirm')"
        >
          Confirm Cards
        </button>
      </div>
    </template>
  </div>
</template>
