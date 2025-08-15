<script setup>
import { ref, onMounted } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const user = useUserStore();

const game = ref(10);

const data = ref([]);

const info = ref({
  10: {
    minmum: 150,
  },
  100: {
    minmum: 60,
  },
});

const handleGameChange = (value) => {
  data.value = [];
  game.value = value;
  getData(value);
  console.log("Game changed to:", game.value);
};

const getData = async () => {
  try {
    const res = await axios.post("/api/api/general/leaderboard", {
      game: game.value,
      phone: user.user,
    });

    if (res.data.status) {
      data.value = res.data.data;
      console.log("Leaderboard data fetched successfully:", data.value);
    } else {
      console.error("Failed to fetch leaderboard data:", res.data.message);
    }
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
  }
};

onMounted(async () => {
  getData(game.value);
});
</script>

<template>
  <div class="w-full h-[100%] p-4">
    <div
      class="w-full h-[100%] max-w-md mx-auto p-4 tracking-widest rounded-xl"
      style="background-color: var(--how-bg)"
    >
      <div
        class="text-center text-2xl font-semibold mb-6 pb-2 flex justify-center items-center gap-4 text-yellow-500 tracking-widest"
      >
        <img src="../assets/badge.png" alt="" class="w-10 h-10" />
        Leaderboard
        <img src="../assets/badge.png" alt="" class="w-10 h-10" />
      </div>

      <div
        class="text-center mb-6 pb-2 flex justify-center items-center gap-4 text-white tracking-widest bg-green-700 rounded-lg py-1 font-bold"
      >
        እየትዝናኑ እየተሸለሙ ያምሹ ቦነስ አለ ይሳተፉ
      </div>
      <div
        class="flex flex-row justify-center items-center gap-8 text-white text-center"
      >
        <div class="flex flex-col items-center">
          <span class="text-2xl font-bold">0</span>
          <span class="text-sm">ቀን</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-2xl font-bold">02</span>
          <span class="text-sm">ሰዓት</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-2xl font-bold">41</span>
          <span class="text-sm">ደቂቃ</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-2xl font-bold">23</span>
          <span class="text-sm">ሰከንድ</span>
        </div>
      </div>

      <div
        class="text-center mb-6 pb-2 flex justify-center items-center gap-4 tracking-widest text-yellow-500 rounded-lg py-1 font-bold"
      >
        ይህ Bonus በተጫወቱት ልክ ነው የሚደመርሎት
      </div>

      <div class="flex gap-2 justify-center items-center">
        <button
          @click="handleGameChange(10)"
          :class="[
            'border border-white rounded-lg py-4 px-6 text-lg font-bold  hover:bg-[#d3d3d3] ',
            game === 10 ? 'bg-[#eee] text-black' : 'text-white',
          ]"
        >
          10 Birr
        </button>

        <button
          @click="handleGameChange(100)"
          :class="[
            'border border-white rounded-lg py-4 px-6 text-lg font-bold  hover:bg-[#d3d3d3] ',
            game === 100 ? 'bg-[#eee] text-black' : 'text-white',
          ]"
        >
          100 Birr
        </button>
      </div>

      <hr class="my-4" />

      <div
        class="text-center mb-6 pb-2 flex justify-center items-center gap-4 tracking-widest text-white rounded-lg py-1 font-bold"
      >
        ይህ Bonus በተጫወቱት ልክ ነው የሚደመርሎት
      </div>

      <hr class="my-4" />

      <div
        class="text-center mb-6 pb-2 tracking-widest text-white rounded-lg py-1 font-bold"
      >
        ቦነስ ተሸላሚ እንዲሆኑ በትንሹ
        <span class="text-red-500">{{ info[game].minmum }} ጨዋታ</span> መጫወት አለቦት
        <br />ቦነስ የሚሸልሙት <span class="text-red-500">ከ1 - 3</span> የወጡ ተሳታፊዎች ናቸው
        1 ጨዋታ እንዲቆጠርሎት <span class="text-red-500">በትንሹ 5 ተጫዋች</span> ሊኖረው ይገባል
      </div>

      <div
        class="w-full h-[8vh] bg-[#303655] rounded-lg flex items-center text-white text-md my-2 max-w-[500px] mx-auto"
      >
        <div
          class="flex-[1] flex justify-center items-center h-full text-center"
        >
          Rank
        </div>
        <div
          class="flex-[3] flex justify-center items-center h-full text-center"
        >
          Username (Phone)
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center"
        >
          Games Played
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center"
        >
          Bonus
        </div>
      </div>

      <div
        v-for="(d, index) in data"
        :key="d.player"
        :class="[
          'w-full  rounded-lg flex items-center text-white text-md my-2 py-1 max-w-[500px] mx-auto text-sm',
          d.player === user.user
            ? 'bg-gradient-to-b from-[#eedc17] to-[#08c356]'
            : 'bg-gradient-to-b from-[#465472] to-[#7FA5C0]',
        ]"
      >
        <div
          class="flex-[1] flex justify-center items-center h-full text-center"
        >
          {{ index + 1 }}ኛ
        </div>
        <div
          class="flex-[3] flex justify-center items-center h-full text-center"
        >
          {{ d.player }}
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center"
        >
          {{ d.count }} Points
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center bg-yellow-500 py-2 rounded-3xl text-red-500 font-bold"
        >
          {{ d.count * 10 }} Birr
        </div>
      </div>
    </div>
  </div>
</template>
