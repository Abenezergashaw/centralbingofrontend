<script setup>
import { onBeforeUnmount, onMounted, onUnmounted, ref } from "vue";
import { connect, io } from "socket.io-client";
import { useBalance } from "../composables/useBalance";
import useCard from "@/composables/useCard";
import { useBingo } from "@/composables/useBingo";
import Card from "@/components/Card.vue";
import WinModal from "@/components/WinModal.vue";
import PreviewCard from "@/components/PreviewCard.vue";
import { useMenuStore } from "@/stores/menu";
import { useRoute } from "vue-router";
import { useUserStore } from "@/stores/user";
import {
  preloadAllAudios,
  unlockAudio,
  playCachedAudio,
} from "@/composables/useAudioManager";
import { SpeakerWaveIcon, SpeakerXMarkIcon } from "@heroicons/vue/24/outline";

// Composable functions
const { get_balance, get_both_balance } = useBalance();
const { get_card } = useCard();
const { check_win } = useBingo();

// pinia stores
const menu = useMenuStore();
const user = useUserStore();

menu.setSelected("game");

const socket = io("http://172.20.10.13:5000");
// const socket = io("http://localhost:5000");
// const socket = io("https://centralbingo.duckdns.org");

const gameStates = ref(["game-select", "card-select", "game"]);
const gameState = ref("game-select");

// General username
const username = ref(user.user);
const balance = ref(0);

// Audio
const audio = ref(false);

// Card
const playingCards = ref({});
const is_bingo = ref(false);
const win_card = ref([]);
const previewCards = ref([]);
const confirmed = ref(false);
// Games
const games = ref([]);
const games_values = ref([]);
const game = ref(null);
const selected_game = ref({});

const cards = Array.from({ length: 200 }, (_, i) => i + 1);

// Generate BINGO numbers
const getNumber = (row, col) => {
  const ranges = [
    [1, 15], // B
    [16, 30], // I
    [31, 45], // N
    [46, 60], // G
    [61, 75], // O
  ];
  const [min, max] = ranges[col - 1];
  return min + (row - 1);
};

// Sockets
// socket.on("games", (d) => {
//   games.value = JSON.parse(d);
// });

socket.on("games", (g) => {
  games.value = JSON.parse(g);
  games_values.value = Object.keys(games.value).map(Number);

  games_values.value.forEach((g) => {
    socket.on(`timer_${g}`, (d) => {
      const data = JSON.parse(d);
      games.value[g] = data;
      selected_game.value = games.value[game.value];
    });
  });
});

// socket.on("timer_10", (d) => {
//   games.value = JSON.parse(d);
// });

const join_game = (g) => {
  // if (!selected_game.value.active) {
  game.value = g;
  game.value = g;
  gameState.value = "card-select";
  socket.emit(`join_room`, `game_${game.value}`, username.value, game.value);
  // }
};

const cartela_selected = (c) => {
  confirmed.value = false;
  socket.emit("cartela_to_home", username.value, game.value);
  socket.emit("cartela_selected", c, game.value, username.value);
};

socket.on(`selected_card_respose_10`, (d) => {
  selected_game.value = JSON.parse(d);
  const f = selected_game.value.players.find(
    (p) => p.user_id === username.value
  );

  if (f) {
    const cartela = f.cartela_number;
    previewCards.value = get_card(cartela);
  } else {
    previewCards.value = [];
  }
});

socket.on(`selected_card_respose_20`, (d) => {
  selected_game.value = JSON.parse(d);
  const f = selected_game.value.players.find(
    (p) => p.user_id === username.value
  );

  if (f) {
    const cartela = f.cartela_number;
    previewCards.value = get_card(cartela);
  } else {
    previewCards.value = [];
  }
});

const getNumberColor = (number) => {
  // const match = props.games.players.find((p) => p.cartela_number === number);
  if (
    selected_game &&
    selected_game.value &&
    Array.isArray(selected_game.value.players)
  ) {
    const match = selected_game.value.players.find(
      (p) =>
        Array.isArray(p.cartela_number) && p.cartela_number.includes(number)
    );

    if (!match)
      return "bg-gradient-to-br from-[#edefff] to-[#fff] opacity-85 rounded"; // Not selected

    return match.user_id === username.value
      ? `${confirmed ? "bg-green-500 rounded-xl" : "bg-red-600 rounded-xl"}`
      : "bg-blue-600 opacity-100 rounded-xl text-white";
  } else {
    // Object isn't ready yet; return a neutral class or nothing
    return "bg-gray-100"; // or return "";
  }
};

socket.on("game-starting", (d) => {
  const players = JSON.parse(d).players || [];
  const userIds = players.map((p) => p.user_id);
  const exists = userIds.includes(username.value);
  if (exists) {
    gameState.value = "game";
    get_balance_in();
    const CartelaNumbers =
      selected_game.value?.players?.find((p) => p.user_id === username.value)
        ?.cartela_number || [];
    playingCards.value = get_card(CartelaNumbers);
  }
});

const get_balance_in = async () => {
  const b = await get_both_balance(user.user);
  user.setUserBalance(b.balance, b.bonus);
};

socket.on("finished_calling", (d) => {
  // console.log("finished_calling", d);
  const players = JSON.parse(d).players || [];
  const userIds = players.map((p) => p.user_id);
  const exists = userIds.includes(username.value);
  if (exists) {
    gameState.value = "game-select";
    is_bingo.value = false;
    selected_game.value = {};
    game.value = null;
  }
});

socket.on("drawing_numbers", (d) => {
  selected_game.value = JSON.parse(d);
  if (gameState.value === "game") {
    if (!audio.value) {
      playCachedAudio(`sound${selected_game.value.current_number}`);
    }
  }
});

socket.on("bingo", (winners_data, drawn_numbers, current_number, l, c) => {
  win_card.value = [];
  console.log("winners_data", winners_data);
  if (winners_data[0].user === "npc") {
    if (gameState.value === "game") {
      is_bingo.value = true;
    }
    win_card.value.push({
      user_id: winners_data[0].user,
      current_number,
      lines: l,
      card: c,
      name: winners_data[0].name,
    });
  } else {
    winners_data.forEach((winner) => {
      const bingo = check_win(winner.cartela, drawn_numbers, current_number);

      if (bingo.status) {
        if (gameState.value === "game") {
          is_bingo.value = true;
        }

        win_card.value.push({
          user_id: winner.user,
          current_number,
          lines: bingo.data.lines,
          card: bingo.data.card,
          name: winner.name, // if server sent winner name too
        });
      }
    });
  }
});

function get_letter(n) {
  if (n >= 1 && n < 16) {
    return {
      letter: "B",
      bg: "bg-purple-900",
    };
  }
  if (n >= 16 && n < 31) {
    return {
      letter: "I",
      bg: "bg-purple-700",
    };
  }
  if (n >= 31 && n < 46) {
    return {
      letter: "B",
      bg: "bg-purple-600",
    };
  }
  if (n >= 46 && n < 61) {
    return {
      letter: "B",
      bg: "bg-cyan-700",
    };
  }
  if (n >= 61 && n < 76) {
    return {
      letter: "B",
      bg: "bg-orange-500",
    };
  }
}

const handle_bingo = (id) => {
  const card = playingCards.value.find((c) => c.id === id);
  const isBlocked = card ? card.is_blocked === true : false;
  if (!isBlocked) {
    if (selected_game.value.active) {
      const bingo = check_win(
        id,
        selected_game.value.drawn_numbers,
        selected_game.value.current_number
      );
      if (bingo.status) {
        socket.emit("bingo", game.value, id, username.value);
      } else {
        for (const card of playingCards.value) {
          if (card.id === id) {
            card.is_blocked = true;
            break;
          }
        }
      }
    }
  }
};

const handle_game_end = () => {
  gameState.value = "game-select";
  is_bingo.value = false;
  selected_game.value = {};
  game.value = null;
};

const handle_card_confirm = () => {
  socket.emit("entering_game", game.value, username.value);
  confirmed.value = true;
  // handle_audio();
};

const handle_go_back = () => {
  socket.emit("go_back", game.value, username.value);
  confirmed.value = true;
};

const handle_audio = async () => {
  unlockAudio();
  audio.value = !audio.value;
};

const audioStatus = () => {
  audio.value = !audio.value;
};

socket.on("go_back_10", (d) => {
  selected_game.value = JSON.parse(d);
});

const selectRandomNumber = () => {
  const a = Math.floor(Math.random() * 200) + 1;
  cartela_selected(a);
};

onMounted(async () => {
  preloadAllAudios(true);
  balance.value = await get_balance(username.value);

  socket.on("connect", () => {
    socket.emit("set_username", username.value);
  });
});

onBeforeUnmount(() => {
  socket.off("drawing_numbers");
  socket.off("bingo");
  if (gameState.value === "game") {
    socket.emit("left_game", `game_${game.value}`, user.user);
  } else if (gameState.value === "card-select") {
    console.log("left_game_before", game.value, user.user);
    socket.emit(
      "left_game_before",
      `game_${game.value}`,
      user.user,
      game.value
    );
  }
});
</script>

<template>
  <!-- Game select  -->
  <div class="w-full py-2 px-4" v-if="gameState === 'game-select'">
    <h2 class="text-2xl text-white text-center tracking-wider">
      Please Choose Your Stake
    </h2>

    <!-- Table Header -->
    <div
      class="w-[100%] h-[8vh] bg-[#303655] rounded-lg flex justify-between items-center text-white text-md my-2 px-1 max-w-[500px] mx-auto"
    >
      <div class="flex justify-center items-center w-[15%] h-full">Stake</div>
      <div class="flex justify-center items-center w-[16%] h-full">Active</div>
      <div class="flex justify-center items-center w-[25%] h-full">
        Possible WIn
      </div>
      <div class="flex justify-center items-center w-[21%] h-full">Play</div>
    </div>

    <div
      v-for="game in games"
      :key="game.value"
      :class="`w-[100%] h-[6.5vh] bg-gradient-to-b ${
        game.value === 10 || game.value === 100
          ? 'from-[#A0C970] to-[#028101]'
          : 'from-[#465472] to-[#7FA5C0]'
      } rounded-lg flex justify-between items-center text-white text-md px-1 my-2 max-w-[500px] mx-auto relative`"
    >
      <div
        class="rotated-box bg-yellow-500 px-2 py-1 rounded-3xl absolute top-[-10px] left-[-20px] text-black"
        v-if="game.value === 10 || game.value === 100"
      >
        Bonus
      </div>
      <div class="flex justify-center items-center w-[15%] h-full">
        {{ game.value }}
      </div>
      <div
        :class="`flex justify-center items-center gap-1 w-[16%] h-full tracking-wider ${
          game.active ? 'text-[#ed0e0e] font-extrabold uppercase' : 'text-white'
        }`"
      >
        <div
          v-show="false"
          class="w-3 h-3 bg-red-500 rounded-full animate-pulse"
        ></div>

        {{
          game.active ? "Playing" : "00:" + String(game.count).padStart(2, "0")
        }}
      </div>
      <div class="flex justify-center items-center w-[23%] h-full gap-2">
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          class="fw-bolder"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M176 249.38 256 170l80 79.38m-80-68.35V342"
          ></path>
          <path
            fill="none"
            stroke-miterlimit="10"
            stroke-width="32"
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
          ></path>
        </svg>
        <div>
          ETB
          {{
            (game.players || []).reduce(
              (total, p) =>
                p.is_active && Array.isArray(p.cartela_number)
                  ? total + p.cartela_number.length
                  : total,
              0
            ) *
            game.value *
            0.8
          }}
        </div>
      </div>
      <div
        :class="`flex justify-center items-center w-[21%] h-[80%]  rounded-lg font-semibold`"
        :style="{
          backgroundColor: 'var(--button-color)',
          color: 'var(--text-color)',
        }"
        @click="join_game(game.value)"
      >
        {{ balance >= game.value ? "Join >>" : "Join >>" }}
      </div>
    </div>
  </div>

  <!-- Card select  -->
  <div class="w-full py-2 px-2" v-if="gameState === 'card-select'">
    <div
      class="text-center text-3xl tracking-widest text-white mb-2"
      v-if="!selected_game.active"
    >
      {{ selected_game.count + " s" }}
    </div>

    <div
      class="text-center text-3xl tracking-widest text-yellow-500 mb-2"
      v-else
    >
      Game started
    </div>

    <div class="flex justify-center items-center gap-4">
      <div
        class="text-base text-white text-center tracking-wider bg-gradient-to-b from-[#4C5775] to-[#9889A9] py-2 px-6 w-48 rounded-2xl"
      >
        {{ game }} Birr Per Card
      </div>

      <button
        @click="selectRandomNumber"
        class="h-full p-2.5 rounded-md"
        style="background-color: var(--button-color)"
      >
        <svg
          stroke="currentColor"
          fill="currentColor"
          stroke-width="0"
          viewBox="0 0 512 512"
          height="1em"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M504.971 359.029c9.373 9.373 9.373 24.569 0 33.941l-80 79.984c-15.01 15.01-40.971 4.49-40.971-16.971V416h-58.785a12.004 12.004 0 0 1-8.773-3.812l-70.556-75.596 53.333-57.143L352 336h32v-39.981c0-21.438 25.943-31.998 40.971-16.971l80 79.981zM12 176h84l52.781 56.551 53.333-57.143-70.556-75.596A11.999 11.999 0 0 0 122.785 96H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12zm372 0v39.984c0 21.46 25.961 31.98 40.971 16.971l80-79.984c9.373-9.373 9.373-24.569 0-33.941l-80-79.981C409.943 24.021 384 34.582 384 56.019V96h-58.785a12.004 12.004 0 0 0-8.773 3.812L96 336H12c-6.627 0-12 5.373-12 12v56c0 6.627 5.373 12 12 12h110.785c3.326 0 6.503-1.381 8.773-3.812L352 176h32z"
          ></path>
        </svg>
      </button>
    </div>

    <!-- confirm selected card  -->
    <PreviewCard
      v-if="!confirmed"
      :cards="previewCards"
      @confirm="handle_card_confirm"
      @go_back="handle_go_back"
    />

    <!-- Cards section  -->
    <div
      class="w-full text-black my-3 rounded-md flex flex-wrap justify-center items-center gap-2 p-2"
      style="background-color: var(--cards-bg)"
    >
      <div
        v-for="c in cards"
        :key="c"
        :class="[
          ' shadow-sm rounded-lg w-10 h-8 flex justify-center items-center text-sm font-semibold cursor-pointer',
          getNumberColor(c),
        ]"
        @click="cartela_selected(c)"
      >
        {{ c }}
      </div>
    </div>

    <div>
      <img src="../assets/banner1.png" alt="" />
    </div>
  </div>

  <!-- Game  -->
  <div class="w-full py-2 px-2" v-if="gameState === 'game'">
    <div
      class="w-full h-20 rounded-lg flex justify-between items-center gap-2 p-2"
      style="background-color: var(--cards-bg)"
    >
      <div
        class="h-14 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-black flex-1 shadow-lg shadow-[#444]"
      >
        <span>Win</span>
        <div>
          ETB
          {{
            (selected_game.players || []).reduce(
              (total, p) =>
                Array.isArray(p.cartela_number)
                  ? total + p.cartela_number.length
                  : total,
              0
            ) *
            selected_game.value *
            0.8
          }}
        </div>
      </div>
      <div
        class="h-14 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-black flex-1 shadow-lg shadow-[#444]"
      >
        <span>Stake</span>
        <span>{{ game }}</span>
      </div>
      <div
        class="h-14 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-black flex-1 shadow-lg shadow-[#444]"
      >
        <span>Call</span>
        <span>{{ selected_game.counter }}</span>
      </div>
      <div
        class="h-14 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-black flex-1 shadow-lg shadow-[#444]"
      >
        <span>Players</span>
        <span>{{
          selected_game?.players?.reduce((total, player) => {
            return (
              total +
              (Array.isArray(player.cartela_number)
                ? player.cartela_number.length
                : 0)
            );
          }, 0)
        }}</span>
      </div>
      <div
        @click="audioStatus"
        class="h-14 flex flex-col justify-center items-center gap-2 bg-white rounded-lg text-black flex-1 shadow-lg shadow-[#444]"
      >
        <SpeakerXMarkIcon v-if="audio" class="w-6 h-6 text-red-500" />
        <SpeakerWaveIcon v-else class="w-6 h-6 text-green-500" />
      </div>
    </div>

    <!-- Balls -->
    <div class="w-full my-2 flex justify-center itc gap-2">
      <div
        class="grid grid-cols-5 gap-1 w-[40%] text-sm text-white px-2 py-4"
        style="background-color: var(--cards-bg)"
      >
        <!-- Column Headers -->
        <div
          v-for="(letter, colIndex) in ['B', 'I', 'N', 'G', 'O']"
          :key="letter"
          class="font-bold text-center py-2 rounded-full w-7 h-7 flex justify-center items-center"
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

        <!-- Number Cells -->
        <template v-for="row in 15" :key="row">
          <div
            v-for="col in 5"
            :key="`${row}-${col}`"
            :class="`p-2 w-6 h-6 flex items-center justify-center rounded-lg text-sm ${
              selected_game.drawn_numbers.includes(getNumber(row, col))
                ? 'bg-red-500'
                : 'bg-gray-700 '
            }`"
          >
            <div>
              {{ getNumber(row, col) }}
            </div>
          </div>
        </template>
      </div>
      <div class="w-[58%] flex flex-col justify-start items-center">
        <div
          :class="[
            'w-52',
            'h-52',

            'rounded-full',
            'flex',
            'justify-center',
            'items-center',
            get_letter(selected_game.current_number).bg,
          ]"
        >
          <div
            class="w-44 h-44 rounded-full border-8 border-white flex flex-col justify-center items-center text-black"
          >
            <div
              class="w-32 h-32 bg-white rounded-full flex flex-col justify-center items-center text-[65px] font-semibold"
            >
              <div class="text-[30px]">
                {{ get_letter(selected_game.current_number).letter }}
              </div>
              <div>{{ selected_game.current_number }}</div>
            </div>
          </div>
        </div>

        <div class="text-white">asd</div>
        <Card :cards="playingCards" @bingo="handle_bingo" />
      </div>
    </div>
  </div>

  <WinModal
    v-if="is_bingo"
    :win_cards="win_card"
    @continue="handle_game_end"
    :username="username"
  />
</template>

<style scoped>
.aspect-square {
  position: relative;
}
.aspect-square::before {
  content: "";
  display: block;
  padding-bottom: 100%;
}
.rotated-box {
  /* width: 200px;
  height: 100px; */

  /* Rotate 20 degrees */
  transform: rotate(-45deg);

  /* Adjust origin if you want to rotate around a different point */
}
</style>
