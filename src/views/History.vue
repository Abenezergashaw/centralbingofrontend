<script setup>
import { onMounted, ref, computed } from "vue";
import axios from "axios";

const username = ref("934596919");
const history = ref([]);

const currentPage = ref(1);
const itemsPerPage = 10;

// Function to count players from comma-separated phones
function countPlayers(phones) {
  return phones.split(",").filter((p) => p.trim() !== "").length;
}

// Computed: total pages
const totalPages = computed(() =>
  Math.ceil(history.value.length / itemsPerPage)
);

// Computed: paginated history
const paginatedHistory = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return history.value.slice(start, start + itemsPerPage);
});

// Computed: visible page numbers (max 5 at a time)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const half = Math.floor(5 / 2);
  let start = Math.max(1, currentPage.value - half);
  let end = Math.min(total, start + 4);

  if (end - start < 4) {
    start = Math.max(1, end - 4);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

onMounted(async () => {
  try {
    const res = await axios.get("/api/api/general/filter_games", {
      params: { phone: username.value },
    });
    history.value = res.data.data;
  } catch (err) {
    console.log(err);
  }
});
</script>

<template>
  <div class="w-full h-[100%] p-1">
    <div
      class="w-full h-[100%] max-w-md mx-auto p-1 tracking-widest rounded-xl"
    >
      <div
        class="text-center text-white text-2xl font-semibold mb-6 pb-2 border-b border-white w-full"
      >
        Bet History
      </div>

      <div class="w-full mt-4 space-y-2 text-sm bg-white text-black">
        <!-- Header -->
        <div
          class="flex justify-between items-center font-semibold bg-gray-200 py-2 px-3 rounded text-black"
        >
          <span class="w-[12%]">No</span>
          <span class="w-[14%]">Stake</span>
          <span class="w-[16%] text-center">Win</span>
          <span class="w-[16%] text-center">Winner Cards</span>
          <span class="w-[14%] text-center">Date</span>
          <span class="w-[12%] text-right">Result</span>
        </div>

        <!-- Rows -->
        <div
          v-for="(h, index) in paginatedHistory"
          :key="index"
          class="flex justify-between items-center border border-gray-300 py-2 px-3 rounded"
        >
          <span class="w-[12%]">{{
            (currentPage - 1) * itemsPerPage + index + 1
          }}</span>
          <span class="w-[14%]">{{ h.game }} Birr</span>
          <span class="w-[16%] text-center">
            {{ (countPlayers(h.players) + h.npc_win) * h.game * 0.8 }} Birr
          </span>
          <span class="w-[16%] text-center">
            <span class="bg-green-600 rounded-lg px-2 py-2">{{
              h.cartela_number
            }}</span>
          </span>
          <span class="w-[14%] text-center">{{ h.date.slice(5, 10) }}</span>
          <span
            :class="`w-[12%] text-right ${
              h.winner === username ? 'text-green-600' : 'text-red-600'
            } font-medium`"
          >
            {{ h.winner === username ? "Win" : "Loss" }}
          </span>
        </div>

        <!-- Pagination -->
        <div class="flex justify-center items-center space-x-2 mt-4 pb-4">
          <button
            @click="goToPage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            &lt;
          </button>
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
              'px-3 py-1 border rounded',
              page === currentPage ? 'bg-blue-500 text-white' : 'bg-white',
            ]"
          >
            {{ page }}
          </button>
          <button
            @click="goToPage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
