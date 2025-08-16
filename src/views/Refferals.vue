<script setup>
import { BanknotesIcon } from "@heroicons/vue/24/outline";
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useUrl } from "@/stores/url";
import axios from "axios";

const user = useUserStore();
const url = useUrl();

const referrals = ref([]);

onMounted(async () => {
  console.log("id: ", user.id);
  const res = await axios.post(`${url.url}/api/general/referrals`, {
    id: user.id,
  });

  if (res.data.success) {
    // Handle successful response
    console.log("Referral data fetched successfully:", res.data.data);
    referrals.value = res.data.data;
  } else {
    console.error("Failed to fetch referral data:", res.data.message);
  }
});
</script>

<template>
  <div class="max-w-md mx-auto p-5 font-sans text-white py-2 px-4">
    <div class="w-full rounded-lg p-2" style="background-color: var(--new-bg)">
      <div class="text-xl text-center my-2 flex items-center justify-center">
        <BanknotesIcon class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
        Referral Income
        <BanknotesIcon class="w-8 h-8 text-yellow-500 mx-auto mb-2" />
      </div>
      <div class="text-center mb-4 tracking-widest underline font-bold text-lg">
        Total Income: ETB
        {{ referrals.length === 0 ? 0 : referrals.length * 3 }}
      </div>
      <div
        class="flex justify-between items-center mb-2 border-2 border-white rounded-lg py-2 text-sm"
      >
        <div class="flex justify-center items-center w-full">No</div>
        <div class="flex justify-center items-center w-full">Friend</div>
        <div class="flex justify-center items-center w-full">Date</div>
        <div class="flex justify-center items-center w-full">Income</div>
      </div>

      <div
        v-for="(referral, index) in referrals"
        :key="index"
        class="flex justify-between items-center mb-2 border-2 border-white rounded-lg py-2 text-sm"
      >
        <div class="flex justify-center items-center w-full">
          {{ index + 1 }}
        </div>
        <div class="flex justify-center items-center w-full">
          {{ referral.new_telegram_id }}
        </div>
        <div class="flex justify-center items-center w-full">
          {{ referral.created_at.slice(0, 10) }}
        </div>
        <div class="flex justify-center items-center w-full">Br. 3</div>
      </div>

      <div
        v-if="Object.keys(referrals).length === 0"
        class="bg-gradient-to-b from-[#4A5673] to-[#948D9F] text-center tracking-widest py-2 rounded-lg"
      >
        No referred user
      </div>
    </div>
  </div>
</template>
