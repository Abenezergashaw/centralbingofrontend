import axios from "axios";
import { useUserStore } from "@/stores/user";
import { useBalance } from "./useBalance";
import { useLoadingStore } from "@/stores/loading";
import { useUrl } from "@/stores/url";

export function useTransaction() {
  const user = useUserStore();
  const loading = useLoadingStore();
  const url = useUrl();
  const { get_both_balance } = useBalance();
  let state = false;
  let message = "";
  const create_deposit_transaction = async (transaction) => {
    loading.setLoading(true);

    const { txn_id, phone, amount, method, type, status } = transaction;
    try {
      const response = await axios.post(
        `${url.url}/api/general/auto_create_deposit_transaction`,
        {
          txn_id,
          phone,
          amount,
          method,
          type,
          status,
        }
      );

      console.log(phone);

      if (response.data.status) {
        const b = await get_both_balance(phone);
        user.setUserBalance(b.balance, b.bonus);
        loading.setLoading(false);
        return {
          state: true,
          message: `Deposit successful. ETB ${response.data.amount} has been added to your account.`,
        };
      } else {
        console.warn("⚠️", response.data.message);
      }
    } catch (error) {
      loading.setLoading(false);

      if (error.response?.status === 409) {
        return {
          state: false,
          message: "Transaction reference used before.",
        };
      } else if (error.response?.status === 400) {
        return {
          state: false,
          message: "Invalid transaction number.",
        };
      } else {
        return {
          state: false,
          message: "Server error. Please try again.",
        };
      }
    }
  };

  const create_withdraw_transaction = async (transaction) => {
    const { phone, amount, method, type, account, name, status } = transaction;
    try {
      const response = await axios.post(
        `${url.url}/api/general/create_withdraw_transaction`,
        {
          phone,
          amount,
          method,
          type,
          account,
          name,
          status,
        }
      );

      if (response.data.status) {
        return {
          state: true,
          message:
            "Transaction created. Please wait for verification. Maximim 5 mins.",
        };
      } else {
        console.warn("⚠️", response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        return {
          state: false,
          message: error.response.data.message,
        };
      }
      return {
        state: false,
        message: "Server error. Please try again.",
      };
    }
  };

  async function get_transactions(phone) {
    const res = await axios.get(`${url.url}/api/general/transactions`, {
      params: { phone },
    });

    if (res.data.status) {
      return res.data;
    } else {
      return res.data;
    }
  }

  async function get_pending_transactions(phone, date) {
    const res = await axios.get(`${url.url}/api/general/pending_transactions`, {
      params: { phone, date },
    });

    if (res.data.status) {
      return res.data;
    } else {
      return res.data;
    }
  }

  const confirm_transactions = async (phone, amount, type, txn_id) => {
    console.log(txn_id, phone, amount, type);
    try {
      const res = await axios.post(
        `${url.url}/api/general/confirm_transaction`,
        {
          phone,
          amount,
          type,
          txn_id,
        }
      );

      // Axios puts the response body in `res.data`
      const data = res.data;

      // No need for res.ok — error responses throw automatically

      return { message: "Transaction confirmed" };
    } catch (err) {
      // Axios puts backend error messages in err.response.data
      const message =
        err.response?.data?.error || err.message || "Unexpected error";
      console.log(message);

      return { message };
    }
  };

  return {
    create_deposit_transaction,
    create_withdraw_transaction,
    get_transactions,
    get_pending_transactions,
    confirm_transactions,
  };
}
