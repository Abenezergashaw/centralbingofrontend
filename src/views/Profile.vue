<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/user";
import axios from "axios";

const user = useUserStore();

const phone = ref(user.user);
const name = ref("Abena Tesfaye");
const invite = ref("356772918");

const handleSubmit = async () => {
  const res = await axios.post("/api/api/general/profile", {
    phone: user.user,
    name: name.value,
  });

  if (res.data.success) {
    alert("Profile updated successfully!");
  } else {
    alert("Failed to update profile. Please try again.");
  }
};
</script>

<template>
  <div class="max-w-md mx-auto p-5 font-sans text-white">
    <h2 class="text-3xl font-bold mb-4 text-center tracking-widest">
      Axum Bingo
    </h2>

    <div class="mb-4">
      <label for="editable" class="block font-medium mb-1">Phone Number</label>
      <input
        id="phone"
        v-model="phone"
        type="text"
        readonly
        placeholder="You can edit this"
        class="w-full text-black tracking-widest px-3 py-2 opacity-75 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div class="mb-4">
      <label for="uneditable1" class="block font-medium mb-1">Name</label>
      <input
        id="uneditable1"
        v-model="name"
        type="text"
        placeholder="Can't edit this"
        class="w-full text-black tracking-widest px-3 py-2 border rounded bg-gray-100 cursor-not-allowed"
      />
    </div>

    <div class="mb-4">
      <label for="uneditable2" class="block font-medium mb-1"
        >Invite code</label
      >
      <input
        id="invite"
        v-model="invite"
        type="text"
        placeholder="Invite code"
        readonly
        class="w-full text-black tracking-widest px-3 py-2 border rounded opacity-75 bg-gray-100 cursor-not-allowed"
      />
    </div>

    <button
      @click="handleSubmit"
      class="w-full bg-yellow-500 hover:bg-yellow-700 text-white py-2 px-4 rounded transition duration-200"
    >
      Save
    </button>
  </div>
</template>
