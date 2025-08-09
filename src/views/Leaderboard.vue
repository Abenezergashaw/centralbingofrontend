<script setup></script>

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
          class="border border-white rounded-lg py-4 px-6 text-lg font-bold"
        >
          10 Birr
        </button>

        <button
          class="border border-white rounded-lg py-4 px-6 text-lg font-bold bg-[#eee] hover:bg-[#d3d3d3] text-black"
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
        ቦነስ ተሸላሚ እንዲሆኑ በትንሹ <span class="text-red-500">60 ጨዋታ</span> መጫወት አለቦት
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
        class="w-full bg-gradient-to-b from-[#465472] to-[#7FA5C0] rounded-lg flex items-center text-white text-md my-2 py-1 max-w-[500px] mx-auto text-sm"
      >
        <div
          class="flex-[1] flex justify-center items-center h-full text-center"
        >
          1ኛ
        </div>
        <div
          class="flex-[3] flex justify-center items-center h-full text-center"
        >
          Jeginaw(*3113)
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center"
        >
          144 Points
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center bg-yellow-500 py-2 rounded-3xl text-red-500 font-bold"
        >
          1500 Birr
        </div>
      </div>

      <div
        class="w-full bg-gradient-to-b from-[#465472] to-[#7FA5C0] rounded-lg flex items-center text-white text-md my-2 py-1 max-w-[500px] mx-auto text-sm"
      >
        <div
          class="flex-[1] flex justify-center items-center h-full text-center"
        >
          1ኛ
        </div>
        <div
          class="flex-[3] flex justify-center items-center h-full text-center"
        >
          Jeginaw(*3113)
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center"
        >
          144 Points
        </div>
        <div
          class="flex-[2] flex justify-center items-center h-full text-center bg-yellow-500 py-2 rounded-3xl text-red-500 font-bold"
        >
          1500 Birr
        </div>
      </div>
    </div>
  </div>
</template>
