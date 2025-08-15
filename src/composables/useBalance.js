import axios from "axios";
import { useUrl } from "@/stores/url";

export function useBalance() {
  const url = useUrl();
  async function get_balance(phone) {
    try {
      const res = await axios.get(
        // "https://centralbingo.duckdns.org/api/general/get_balance",
        `${url.url}/api/general/get_balance`,
        {
          params: { phone },
          headers: { "Cache-Control": "no-cache" },
        }
      );

      if (res.data.status) {
        return res.data.balance + res.data.bonus;
      } else {
        return 0; // User found, but has no data? (unlikely)
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        return 0;
      } else {
        console.error("Request failed:", err.message);
        return 0;
      }
    }
  }

  async function get_both_balance(phone) {
    try {
      const res = await axios.get(`${url.url}/api/general/get_balance`, {
        params: { phone },
      });

      if (res.data.status) {
        return { balance: res.data.balance, bonus: res.data.bonus };
      } else {
        return 0; // User found, but has no data? (unlikely)
      }
    } catch (err) {
      if (err.response && err.response.status === 404) {
        console.warn("User not found");
        return 0;
      } else {
        console.error("Request failed:", err.message);
        return 0;
      }
    }
  }

  return { get_balance, get_both_balance };
}
