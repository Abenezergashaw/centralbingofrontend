<script setup>
import { ref } from "vue";

const items = ref([
  {
    title: "መደብ ከመምረጦ በፊት Playing ውይም ሰከንድ ሚቆጥረው ምንድን ነው?",
    content:
      "Playing ማልት ከጎኑ የሚያሳየውን የደራሽ መጠን ብር ያለው ጨዋታ እየተጫወቱ ያሉ አሉ ማለት ነው ስለዚህ እነሱ ከጨረሱ በኋላ ሰከንድ ጠብቆ በመግባት የደራሽ መጠንን ማስፋት ይቻላል።",
  },
  {
    title: "እንዴት ማሸነፍ እንችላለን?",
    content:
      "የሚጠሩትን ቁጥሮች በእርስዎ ካርድ ላይ እየነኩ ሄደው አንድ መስመር ወይም 4ኮርነር ከሰሩ አሸናፊ ይሆናሉ።",
  },
  {
    title: "አንድ አሸናፊ ብቻ ነው የሚኖረው?",
    content:
      "በ አንድ ጨዋታ ከአንድ በላይ አሸናፊ ሊኖር ይችላል ማለትም ከአንድ በላይ ሰዎች እኩል ሊዘጉ ይችላሉ ይህም ከሆነ የደራሽ መጠንን የሚካፈሉት ይሆናል።",
  },
]);

const openIndex = ref(null);

function toggle(index) {
  openIndex.value = openIndex.value === index ? null : index;
}
</script>

<template>
  <div class="w-full h-[100%] p-4">
    <div
      class="w-full h-[100%] max-w-md mx-auto p-4 tracking-widest rounded-xl"
      style="background-color: var(--how-bg)"
    >
      <div
        class="text-center text-white text-2xl font-semibold mb-6 pb-2 border-b border-[#634833]"
      >
        እንዴት መጫወት እንችላለን
      </div>
      <div v-for="(item, index) in items" :key="index" class="my-6 px-2">
        <button
          class="w-full text-left px-4 py-6 flex justify-between items-center gap-4 text-white font-semibold border-2 border-t-[#545454] border-l-[#545454] border-b-[#000] border-r-[#000]"
          style="background-color: var(--how-bg)"
          @click="toggle(index)"
        >
          <img src="../assets/gavel.png" class="w-7 h-7" />
          <span class="font-medium">{{ item.title }}</span>
          <span class="text-4xl font-bold">{{
            openIndex === index ? "-" : "+"
          }}</span>
        </button>
        <div
          v-if="openIndex === index"
          class="px-6 py-3 font-semibold text-white"
        >
          {{ item.content }}
        </div>
      </div>
    </div>
  </div>
</template>
