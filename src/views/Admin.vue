<script setup>
import AdminBalance from "@/components/AdminBalance.vue";
import { onMounted, ref } from "vue";
import { useAdminBalance } from "@/composables/useAdminBalance";
import { useUserStore } from "../stores/user";
const user = useUserStore();

const { get_cashflow } = useAdminBalance();

const cashflow = ref([]);

const handle_get_cashflow = async (from, to) => {
  cashflow.value = await get_cashflow(user.user, from, to);
  //   console.log(from, to);
};

onMounted(async () => {
  cashflow.value = await get_cashflow(user.user);
});
</script>

<template>
  <AdminBalance
    :cashflow="cashflow"
    @get_cashflow_custom="handle_get_cashflow"
  />
</template>
