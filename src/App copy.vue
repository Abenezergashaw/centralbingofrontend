<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import bg from "@/assets/bg.png";

const isMobile = ref(window.innerWidth < 701);

const handleResize = () => {
  isMobile.value = window.innerWidth < 701;
};

const phoneNumber = ref("0934596919");
const password = ref("123456");
const loginFailed = ref(true);

const handleLogin = (e) => {
  e.preventDefault();
  // fake login logic
  if (phoneNumber.value !== "0934596919" || password.value !== "123456") {
    loginFailed.value = true;
  } else {
    loginFailed.value = false;
    // continue to dashboard
  }
};

onMounted(() => {
  window.addEventListener("resize", handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div
    class="w-[100vw] h-[100vh] flex justify-center items-center p-5"
    :style="
      isMobile
        ? {
            backgroundColor: '#3C1A5B ',
          }
        : {
            backgroundImage: `url(${bg})`,
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }
    "
  >
    <div
      class="bg-orange-400 rounded shadow w-full max-w-[500px] mx-auto mt-10"
    >
      <div class="text-center my-4 flex justify-center">
        <img
          src="./assets/logo.png"
          alt="user avatar"
          class="mb-3"
          style="width: auto; height: 80px"
        />
      </div>

      <div class="bg-white rounded-t-lg pt-3">
        <h2 class="font-bold text-gray-800 mb-2 text-center text-2xl">Login</h2>
        <p class="text-gray-500 mb-4 mx-auto text-center">
          Sign in to continue.
        </p>

        <h6 v-if="loginFailed" class="text-red-600 text-center font-bold mb-4">
          Login failed. Try again.
        </h6>

        <form @submit="handleLogin" class="px-5">
          <div class="mb-3">
            <label class="block text-sm font-medium mb-1" for="phoneNumber"
              >Phone Number</label
            >
            <input
              class="form-input w-full px-4 py-2 rounded"
              type="text"
              id="phoneNumber"
              placeholder="Enter Phone Number"
              v-model="phoneNumber"
              required
              autocomplete="off"
              style="background-color: rgb(233, 236, 239)"
            />
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium mb-1" for="password"
              >Password</label
            >
            <input
              class="form-input w-full px-4 py-2 rounded"
              type="password"
              id="password"
              placeholder="Enter Password"
              v-model="password"
              required
              style="background-color: rgb(233, 236, 239)"
            />
          </div>

          <button
            type="submit"
            class="btn btn-primary w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Log in
          </button>
        </form>

        <div
          class="flex flex-col justify-center items-center mt-3 text-sm text-gray-500 px-5 pb-3"
        >
          <a class="text-blue-600 hover:underline mb-1" href="/resetpassword"
            >Forgot Password?</a
          >
          <a class="text-blue-600 hover:underline" href="/Signup">Signup!</a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Optionally add rounded-top-right like your original style */
.rounded-t-lg {
  border-top-right-radius: 8rem;
  border-top-left-radius: 1rem;
}
</style>
