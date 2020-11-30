<template>
  <div class="container p-4">
    <div class="form-group">
      <label>Withdraw address</label>
      <input type="text" class="form-control" v-model="address" />
    </div>

    <div class="form-group">
      <label>Amount (Min: 500)</label>
      <input type="number" class="form-control" v-model="amount" />
    </div>

    <div v-if="isLoading" class="spinner-border text-primary mb-3"></div>
    <button
      v-else
      type="button"
      class="btn btn-primary btn-block mb-3"
      @click="withdraw"
    >
      Withdraw
    </button>

    <p class="mb-3">Balance: {{ balance.toFixed(6) }}</p>

    <div class="table-responsive-sm" id="list">
      <table class="table table-striped text-center">
        <thead>
          <th>Time</th>
          <th>Amount</th>
          <th>Address</th>
        </thead>
        <tbody>
          <tr
            class="text-danger"
            v-for="withdraw in withdrawList"
            :key="withdraw._id"
          >
            <td>{{ moment(withdraw.time).fromNow() }}</td>
            <td>-{{ withdraw.amount.toFixed(6) }}</td>
            <td>{{ withdraw.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import API_URL from "@/utils/apiUrl";

export default {
  data() {
    return {
      isLoading: false,
      address: "",
      amount: 0,
      balance: 0,
      withdrawList: [],
    };
  },
  mounted: function () {
    this.fetchProfile();
    this.fetchWithdraw();
  },
  methods: {
    fetchProfile: function () {
      axios({
        url: API_URL + "/profile?userName=" + localStorage.getItem("userName"),
        method: "GET",
      }).then((response) => {
        let data = response.data;
        // console.log(data);
        this.balance = data.data.balance;
      });
    },
    fetchWithdraw: function () {
      axios({
        url: API_URL + "/withdraw?userName=" + localStorage.getItem("userName"),
        method: "GET",
      }).then((response) => {
        let data = response.data;
        // console.log(data);
        if (data.data.docs.length == 0)
          return $("#list").html(`¯|_(ツ)_/¯ You don’t have any withdraw yet`);
        this.withdrawList = data.data.docs;
      });
    },
    withdraw: function () {
      this.isLoading = true;
      axios({
        url: API_URL + "/withdraw",
        method: "POST",
        headers: {
          Auth: localStorage.getItem("token"),
        },
        data: {
          userName: localStorage.getItem("userName"),
          address: this.address,
          amount: this.amount,
        },
      }).then((response) => {
        this.isLoading = false;
        let data = response.data;
        // console.log(data);
        if (!data.status) return this.showAlert(data.message, false);

        this.showAlert("Withdraw success");
      });
    },
  },
};
</script>

<style>
</style>