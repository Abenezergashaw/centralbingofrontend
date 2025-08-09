import axios from "axios";

export function useTransaction() {
  let state = false;
  let message = "";
  const create_deposit_transaction = async (transaction) => {
    const { txn_id, phone, amount, method, type, status } = transaction;
    try {
      const response = await axios.post(
        "/api/api/general/create_deposit_transaction",
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
        return {
          state: true,
          message:
            "Transaction created. Please wait for verification. Maximim 5 mins.",
        };
      } else {
        console.warn("⚠️", response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 409) {
        return {
          state: false,
          message: "Transaction reference used before.",
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
        "/api/api/general/create_withdraw_transaction",
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
    const res = await axios.get("/api/api/general/transactions", {
      params: { phone },
    });

    if (res.data.status) {
      return res.data.data;
    } else {
      console.error("Error:", res.data.message);
    }
  }

  async function get_pending_transactions(phone, date) {
    const res = await axios.get("/api/api/general/pending_transactions", {
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
      const res = await axios.post("/api/api/general/confirm_transaction", {
        phone,
        amount,
        type,
        txn_id,
      });

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
