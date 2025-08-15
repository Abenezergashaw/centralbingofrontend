<script setup>
import { onMounted, ref, computed } from "vue";
import { useTransaction } from "@/composables/useTransactions";
import { useBalance } from "@/composables/useBalance";
import axios from "axios";
import { useUserStore } from "../stores/user";
import { useLoadingStore } from "@/stores/loading";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
// composable functions
const {
  create_deposit_transaction,
  create_withdraw_transaction,
  get_transactions,
  get_pending_transactions,
  confirm_transactions,
} = useTransaction();
const { get_balance, get_both_balance } = useBalance();

// Pinia stores
const user = useUserStore();
const loading = useLoadingStore();
// Generals
const username = ref(user.user);
const real_balance = ref(user.balance);
const bonus_balance = ref(0);
const copied = ref(false);
const success = ref("");
const error = ref("");

const userActions = ref(["deposit", "withdraw", "transfer", "history"]);
const currentUserAction = ref("deposit");

const banks = ["telebirr"];
// const banks = ["telebirr", "cbe", "boa"];
const accounts = {
  // cbe: {
  //   name: "Fanuel Desse",
  //   account: "1000475610664",
  // },
  // boa: {
  //   name: "Fanuel Desse",
  //   account: "168286813",
  // },
  telebirr: {
    name: "Fanuel Desse",
    account: "0938880223",
  },
};

// Deposit
const deposit_bank = ref("telebirr");
const deposit_message = ref("");

// Withdraw
const withdraw_bank = ref("telebirr");
const withdraw_name = ref("");
const withdraw_account = ref("");
const withdraw_amount = ref();

// history
const transactions = ref([]);

// Transfer
const transferPhone = ref(null);
const transferAmount = ref(null);

function get_image_link(bank) {
  return new URL(`../assets/${bank}.png`, import.meta.url).href;
}

const copy_to_clipboard = async (acc) => {
  try {
    await navigator.clipboard.writeText(acc);
    copied.value = true;
    setTimeout(() => (copied.value = false), 2000); // Clear after 2 sec
  } catch (err) {
    copied.value = true;
  }
};

const extract_messages = () => {
  let match;
  if (deposit_bank.value === "telebirr") {
    match = deposit_message.value.match(
      /transferred ETB\s?([\d,.]+).*?transaction number is ([A-Z0-9]+)/i
    );
  } else if (deposit_bank.value === "cbe") {
    match = deposit_message.value.match(
      /debited with ETB\s?([\d,.]+).*?id=([A-Z0-9]+)/i
    );
  } else if (deposit_bank.value === "boa") {
    match = deposit_message.value.match(
      /debited with ETB\s?([\d,.]+).*?trx=([A-Z0-9]+)/i
    );
  }
  if (match) {
    const [, amount, reference] = match;
    return { amount, reference };
  }

  return { amount: null, reference: null };
};

const handle_deposit = async () => {
  const { amount, reference } = extract_messages();
  if (amount && reference) {
    const transaction = {
      txn_id: reference,
      phone: username.value,
      amount,
      method: deposit_bank.value,
      type: "d",
      status: "pending",
    };

    const res = await create_deposit_transaction(transaction);

    if (res.status) {
      success.value = res.message;
    } else {
      error.value = res.message;
    }
  } else {
    error.value = "Text can not be read. Please check and try again.";
  }
};

const handle_withdraw = async () => {
  error.value = ""; // Reset error before validation

  // Validation logic
  const amount = parseFloat(withdraw_amount.value);
  const name = withdraw_name.value.trim();
  const account = withdraw_account.value.trim();
  const bank = withdraw_bank.value;

  const isAmountValid = !isNaN(amount) && amount >= 100 && amount <= 1000;
  const isNameValid = /^[A-Za-z\s]+$/.test(name);

  let isAccountValid = false;

  if (bank === "telebirr") {
    isAccountValid = /^0[79]\d{8}$/.test(account);
  } else if (bank === "cbe") {
    isAccountValid = /^\d{13}$/.test(account);
  } else if (bank === "boa") {
    isAccountValid = /^\d{8,13}$/.test(account);
  }

  // Collect errors
  if (!isAmountValid) {
    error.value = "Withdraw amount must be between 100 and 1000 birr.";
  } else if (!isNameValid) {
    error.value = "Name must only contain letters and spaces.";
  } else if (!isAccountValid) {
    if (bank === "telebirr") {
      error.value =
        "Telebirr account must be 10 digits and start with 09 or 07.";
    } else if (bank === "cbe") {
      error.value = "CBE account must be exactly 13 digits.";
    } else if (bank === "boa") {
      error.value = "BOA account must be between 8 and 13 digits.";
    } else {
      error.value = "Invalid bank selected.";
    }
  } else {
    // All valid — proceed
    const transaction = {
      phone: username.value,
      amount,
      method: bank,
      type: "w",
      account,
      name,
      status: "pending",
    };

    const res = await create_withdraw_transaction(transaction);

    if (res.status) {
      success.value = res.message;
    } else {
      error.value = res.message;
    }
  }
};

async function handle_transfer() {
  success.value = "";
  error.value = "";

  const phonePattern = /^(7|9)\d{8}$/; // starts with 7 or 9, total 9 digits
  const amountPattern = /^\d+$/; // digits only

  if (!phonePattern.test(transferPhone.value)) {
    error.value =
      "Phone number must start with 7 or 9 and be exactly 9 digits.";
    return;
  }

  if (username.value === transferPhone.value) {
    error.value = "Cannot transfer to own account";
    return;
  }

  if (!amountPattern.test(transferAmount.value)) {
    error.value = "Amount must contain only digits.";
    return;
  }

  if (parseInt(transferAmount.value, 10) < 10) {
    error.value = "Amount must be greater than 10.";
    return;
  }

  // ✅ Passed validation — return values or send to API
  // success.value = `Phone: ${transferPhone.value}, Amount: ${transferAmount.value}`;
  // console.log({
  //   phone: transferPhone.value,
  //   amount: parseInt(transferAmount.value, 10),
  // });

  // Here you can send data to API if needed
  const res = await axios.post("/api/api/general/transfer", {
    phone1: username.value,
    phone2: transferPhone.value,
    amount: parseInt(transferAmount.value, 10),
  });
  if (res.data.status) {
    get_balance_in();

    success.value = res.data.message;
  } else {
    error.value = res.data.message;
  }
}

const get_balance_in = async () => {
  const b = await get_both_balance(username.value);
  user.setUserBalance(b.balance, b.bonus);
};

const currentPage = ref(1);
const itemsPerPage = ref(10);

const totalPages = computed(() =>
  Math.ceil(transactions.value.length / itemsPerPage.value)
);

const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return transactions.value.slice(start, end);
});

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split("T")[0];
};

onMounted(async () => {
  get_balance_in();

  // Load history
  const transactionsRes = await get_transactions(username.value);
  if (transactionsRes.status) {
    transactions.value = transactionsRes.data;
  } else {
    console.error("Error loading transactions:", transactionsRes.message);
  }
});
</script>

<template>
  <div class="w-full h-40 bg-white mt-20 p-4 text-black flex gap-2">
    <div
      :class="`w-[24%] h-28 rounded-lg flex flex-col justify-center items-center ${
        currentUserAction === 'deposit'
          ? 'bg-blue-500 text-white'
          : 'text-black'
      }`"
      @click="currentUserAction = 'deposit'"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 256 256"
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M128,35.31V128a8,8,0,0,1-16,0V35.31L93.66,53.66A8,8,0,0,1,82.34,42.34l32-32a8,8,0,0,1,11.32,0l32,32a8,8,0,0,1-11.32,11.32Zm64,88.31V96a16,16,0,0,0-16-16H160a8,8,0,0,0,0,16h16v80.4A28,28,0,0,0,131.75,210l.24.38,22.26,34a8,8,0,0,0,13.39-8.76l-22.13-33.79A12,12,0,0,1,166.4,190c.07.13.15.26.23.38l10.68,16.31A8,8,0,0,0,192,202.31V144a74.84,74.84,0,0,1,24,54.69V240a8,8,0,0,0,16,0V198.65A90.89,90.89,0,0,0,192,123.62ZM80,80H64A16,16,0,0,0,48,96V200a8,8,0,0,0,16,0V96H80a8,8,0,0,0,0-16Z"
        ></path>
      </svg>
      <span>Deposit</span>
    </div>
    <div
      :class="`w-[24%] h-28 rounded-lg flex flex-col  justify-center items-center ${
        currentUserAction === 'withdraw'
          ? 'bg-blue-500 text-white'
          : 'text-black'
      }`"
      @click="currentUserAction = 'withdraw'"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 640 512"
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M621.16 54.46C582.37 38.19 543.55 32 504.75 32c-123.17-.01-246.33 62.34-369.5 62.34-30.89 0-61.76-3.92-92.65-13.72-3.47-1.1-6.95-1.62-10.35-1.62C15.04 79 0 92.32 0 110.81v317.26c0 12.63 7.23 24.6 18.84 29.46C57.63 473.81 96.45 480 135.25 480c123.17 0 246.34-62.35 369.51-62.35 30.89 0 61.76 3.92 92.65 13.72 3.47 1.1 6.95 1.62 10.35 1.62 17.21 0 32.25-13.32 32.25-31.81V83.93c-.01-12.64-7.24-24.6-18.85-29.47zM48 132.22c20.12 5.04 41.12 7.57 62.72 8.93C104.84 170.54 79 192.69 48 192.69v-60.47zm0 285v-47.78c34.37 0 62.18 27.27 63.71 61.4-22.53-1.81-43.59-6.31-63.71-13.62zM320 352c-44.19 0-80-42.99-80-96 0-53.02 35.82-96 80-96s80 42.98 80 96c0 53.03-35.83 96-80 96zm272 27.78c-17.52-4.39-35.71-6.85-54.32-8.44 5.87-26.08 27.5-45.88 54.32-49.28v57.72zm0-236.11c-30.89-3.91-54.86-29.7-55.81-61.55 19.54 2.17 38.09 6.23 55.81 12.66v48.89z"
        ></path>
      </svg>
      <span>Withdraw</span>
    </div>
    <div
      :class="`w-[24%] h-28 rounded-lg flex flex-col justify-center items-center ${
        currentUserAction === 'transfer'
          ? 'bg-blue-500 text-white'
          : 'text-black'
      }`"
      @click="currentUserAction = 'transfer'"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 168v-16c0-13.255 10.745-24 24-24h360V80c0-21.367 25.899-32.042 40.971-16.971l80 80c9.372 9.373 9.372 24.569 0 33.941l-80 80C409.956 271.982 384 261.456 384 240v-48H24c-13.255 0-24-10.745-24-24zm488 152H128v-48c0-21.314-25.862-32.08-40.971-16.971l-80 80c-9.372 9.373-9.372 24.569 0 33.941l80 80C102.057 463.997 128 453.437 128 432v-48h360c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24z"
        ></path>
      </svg>
      <span>Transfer</span>
    </div>
    <div
      :class="`w-[24%] h-28 rounded-lg flex flex-col justify-center items-center ${
        currentUserAction === 'history'
          ? 'bg-blue-500 text-white'
          : 'text-black'
      }`"
      @click="currentUserAction = 'history'"
    >
      <svg
        stroke="currentColor"
        fill="currentColor"
        stroke-width="0"
        viewBox="0 0 512 512"
        height="25"
        width="25"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M504 255.531c.253 136.64-111.18 248.372-247.82 248.468-59.015.042-113.223-20.53-155.822-54.911-11.077-8.94-11.905-25.541-1.839-35.607l11.267-11.267c8.609-8.609 22.353-9.551 31.891-1.984C173.062 425.135 212.781 440 256 440c101.705 0 184-82.311 184-184 0-101.705-82.311-184-184-184-48.814 0-93.149 18.969-126.068 49.932l50.754 50.754c10.08 10.08 2.941 27.314-11.313 27.314H24c-8.837 0-16-7.163-16-16V38.627c0-14.254 17.234-21.393 27.314-11.314l49.372 49.372C129.209 34.136 189.552 8 256 8c136.81 0 247.747 110.78 248 247.531zm-180.912 78.784l9.823-12.63c8.138-10.463 6.253-25.542-4.21-33.679L288 256.349V152c0-13.255-10.745-24-24-24h-16c-13.255 0-24 10.745-24 24v135.651l65.409 50.874c10.463 8.137 25.541 6.253 33.679-4.21z"
        ></path>
      </svg>
      <span>History</span>
    </div>
  </div>

  <div class="flex justify-center items-center gap-4 my-4">
    <div
      class="bg-white rounded-lg text-black flex flex-col justify-center items-center gap-4 h-28 my-2 px-6"
    >
      <span class="text-xl">Main Balance</span>
      <span class="font-bold tracking-widest"
        >ETB {{ user.real_balance }} Birr</span
      >
    </div>

    <div
      class="bg-white rounded-lg text-black flex justify-center items-center gap-4 h-28 my-2 px-6 flex-col"
    >
      <span class="text-xl">Bonus Balance</span>
      <span class="font-bold tracking-widest"
        >ETB {{ user.bonus_balance }} Birr</span
      >
    </div>
  </div>

  <!-- Deposit  -->
  <div class="p-4" v-if="currentUserAction === 'deposit'">
    <div
      class="w-full rounded-xl p-6 shadow-xl flex flex-col items-center"
      style="background-color: var(--cards-bg)"
    >
      <!-- Manual Deposit Section -->
      <div class="w-full max-w-md backdrop-blur-sm p-6 rounded-xl shadow-md">
        <h3 class="text-xl font-bold text-black mb-4 text-center">
          Bank Transfer
        </h3>

        <div class="text-sm text-center mb-2 text-black tracking-widest">
          Choose payment method for manual deposit:
        </div>
        <div class="flex justify-center items-center gap-4">
          <div
            v-for="(bank, index) in banks"
            :key="index"
            @click="
              () => {
                deposit_bank = bank;
                deposit_message = '';
                success = '';
                error = '';
              }
            "
            :class="`flex items-center gap-2 mb-2   rounded-lg p-2 ${
              bank === deposit_bank
                ? 'border-yellow-500 border-4 scale-110'
                : 'border-teal-700 border'
            }`"
          >
            <img :src="get_image_link(bank)" class="h-8" />
          </div>
        </div>
        <hr class="bg-black w-full" />
        <div
          v-if="deposit_bank !== ''"
          class="my-2 tracking-wider w-full flex justify-center items-center flex-col"
        >
          <div class="mb-2 text-black">
            Selected Bank:
            <span class="font-bold text-black">
              {{ deposit_bank.toUpperCase() }}
            </span>
          </div>
          <hr class="bg-black w-full mb-2" />

          <div class="text-black">
            <div class="flex justify-center items-center gap-1">
              Name:
              <span class="font-bold">
                {{ accounts[deposit_bank].name }}
              </span>
            </div>
            <div class="flex justify-center items-center gap-1">
              Account:
              <span class="font-bold">
                {{ accounts[deposit_bank].account }}
              </span>
              <span
                class="ml-2 mb-1"
                @click="copy_to_clipboard(accounts[deposit_bank].account)"
                >📋</span
              >
              <div v-if="copied" class="text-yellow-500">Copied!</div>
            </div>
          </div>
          <hr class="w-full bg-black my-2" />
          <div class="text-center text-black">
            Deposit the amount you want to the above account from
            <span class="font-bold">{{ deposit_bank.toUpperCase() }}</span> and
            send the confirmation message from the bank below.
          </div>
          <hr class="w-full bg-black my-2" />
          <div>
            <textarea
              v-model="deposit_message"
              rows="4"
              cols="38"
              class="p-2 rounded-lg w-full text-black"
              :placeholder="`Enter the message from ${deposit_bank.toUpperCase()} here and send...`"
            ></textarea>

            <ArrowPathIcon
              v-if="loading.loading"
              class="w-8 h-6 animate-spin text-yellow-500 text-center mx-auto my-2"
              aria-hidden="true"
            />
            <button
              v-if="!loading.loading"
              @click="handle_deposit"
              class="bg-yellow-500 w-full p-4 rounded-lg text-black text-base"
            >
              Send ➤
            </button>
            <div v-show="success !== ''" class="text-center text-green-600">
              {{ success }}
            </div>
            <div v-show="error !== ''" class="text-center text-red-600">
              {{ error }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Withdraw  -->
  <div class="p-4" v-else-if="currentUserAction === 'withdraw'">
    <div
      class="w-full rounded-lg p-4 shadow-lg shadow-gray-600 flex flex-col justify-center items-center text-white"
      style="background-color: var(--cards-bg)"
    >
      <div class="text-sm mb-1 font-bold">Choose payment method:</div>
      <div class="flex justify-between items-center gap-4">
        <div
          v-for="(bank, index) in banks"
          :key="index"
          @click="
            () => {
              withdraw_bank = bank;
              deposit_message = '';
              success = '';
              error = '';
            }
          "
          :class="`flex items-center gap-2 mb-2   rounded-lg p-2 ${
            bank === withdraw_bank
              ? 'border-yellow-500 border-4 scale-110'
              : 'border-teal-700 border'
          }`"
        >
          <img :src="get_image_link(bank)" class="h-8" />
        </div>
      </div>
      <div v-if="withdraw_bank !== ''">
        <div class="text-sm mb-1 font-bold">
          Enter your information below for
          <span class="font-bold">{{ withdraw_bank.toUpperCase() }}</span>
        </div>
        <div class="flex items-center gap-2 w-full my-1">
          <div class="w-20">Name</div>
          <input
            type="text"
            v-model="withdraw_name"
            placeholder="Enter your name..."
            class="w-full p-3 text-black"
          />
        </div>

        <div class="flex items-center gap-2 w-full my-1">
          <div class="w-20">Account</div>
          <input
            type="text"
            v-model="withdraw_account"
            placeholder="Enter your account..."
            class="w-full p-3 text-black"
          />
        </div>

        <div class="flex items-center gap-2 w-full my-1">
          <div class="w-20">Amount</div>
          <input
            type="text"
            v-model="withdraw_amount"
            placeholder="Enter your amount..."
            class="w-full p-3 text-black"
          />
        </div>

        <button
          @click="handle_withdraw"
          class="bg-yellow-500 w-full p-4 rounded-lg text-white text-base my-1"
        >
          Submit ➤
        </button>
        <div v-show="success !== ''" class="text-center text-green-600">
          {{ success }}
        </div>
        <div v-show="error !== ''" class="text-center text-red-600">
          {{ error }}
        </div>
      </div>
    </div>
  </div>

  <!-- Transfer  -->
  <div class="p-4 text-white" v-else-if="currentUserAction === 'transfer'">
    <div class="text-xl tracking-widest font-bold text-center mb-2">
      Transfer Amount
    </div>
    <div class="flex items-center gap-2 w-full my-2 px-4">
      <div class="flex-1 text-lg">Phone Number</div>
      <input
        type="text"
        v-model="transferPhone"
        placeholder="9********"
        class="flex-1 p-3 text-black rounded-lg"
      />
    </div>
    <div class="flex items-center gap-2 w-full my-1 px-4">
      <div class="flex-1 text-lg my-2">Amount</div>
      <input
        type="text"
        v-model="transferAmount"
        placeholder="eg. 10"
        class="flex-1 p-3 text-black rounded-lg"
      />
    </div>
    <button
      @click="handle_transfer"
      class="bg-yellow-500 w-full p-4 rounded-lg text-white text-base my-1"
    >
      Transfer ➤
    </button>
    <div v-show="success !== ''" class="text-center text-green-600">
      {{ success }}
    </div>
    <div v-show="error !== ''" class="text-center text-red-600">
      {{ error }}
    </div>
  </div>
  <!-- History  -->
  <div class="p-4 text-[10px]" v-if="currentUserAction === 'history'">
    <div
      class="w-full rounded-lg p-4 shadow-lg shadow-gray-600"
      style="background-color: var(--cards-bg)"
    >
      <!-- Header Row -->
      <div
        class="grid grid-cols-4 font-semibold text-black border-b border-black pb-2 mb-2"
      >
        <div class="text-center">Type</div>
        <div class="text-center">Date</div>
        <div class="text-center">Amount</div>
        <div class="text-center">Status</div>
      </div>

      <!-- Transactions Rows -->
      <div
        v-for="transaction in paginatedTransactions"
        :key="transaction.txn_id"
        class="grid grid-cols-4 text-white p-2 rounded-md mb-2"
        style="background-color: var(--bg-color)"
      >
        <div class="text-center">
          {{ transaction.type === "d" ? "Deposit" : "Withdraw" }}
        </div>
        <div class="text-center">
          {{ formatDate(transaction.created_at) }}
        </div>
        <div class="text-center">{{ transaction.amount }}</div>
        <div class="text-center capitalize">{{ transaction.status }}</div>
      </div>

      <!-- Pagination Controls -->
      <div class="flex justify-center items-center mt-4 gap-2">
        <button
          @click="prevPage"
          :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md"
          :class="
            currentPage === 1
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          "
        >
          Prev
        </button>

        <span class="mx-2"> Page {{ currentPage }} of {{ totalPages }} </span>

        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md"
          :class="
            currentPage === totalPages
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          "
        >
          Next
        </button>
      </div>
    </div>
  </div>
</template>
