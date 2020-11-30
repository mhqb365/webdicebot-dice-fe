<template>
  <div class="container p-4">
    <div class="table-responsive-sm">
      <table class="table table-striped text-center">
        <thead>
          <th>Wagered</th>
          <th>Balance</th>
          <th>Profit</th>
          <th>Bets</th>
          <th>Wins</th>
          <th>Losses</th>
        </thead>
        <tbody>
          <td>{{ wagered.toFixed(6) }}</td>
          <td>{{ balance.toFixed(6) }}</td>
          <td
            v-bind:class="{
              'text-success': Number(profit) >= 0,
              'text-danger': Number(profit) < 0,
            }"
          >
            {{ profit.toFixed(6) }}
          </td>
          <td>{{ bets }}</td>
          <td class="text-success">{{ wins }}</td>
          <td class="text-danger">{{ losses }}</td>
        </tbody>
      </table>
    </div>

    <div class="row text-center mb-3">
      <div class="col-6">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Prediction</span>
          </div>
          <input type="number" class="form-control" v-model="prediction" />
        </div>
      </div>
      <div class="col-6">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Amount</span>
          </div>
          <input type="number" class="form-control" v-model="betAmount" />
          <div class="input-group-append">
              <button type="button" class="btn btn-primary" @click="changeAmount(0)">Min</button>
              <button type="button" class="btn btn-warning" @click="changeAmount(1)">X2</button>
              <button type="button" class="btn btn-primary" @click="changeAmount(2)">1/2</button>
              <button type="button" class="btn btn-danger" @click="changeAmount(3)">Max</button>
          </div>
        </div>
      </div>
    </div>

    <div class="row text-center">
      <div class="col-6">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Result</span>
          </div>
          <input type="number" class="form-control" v-model="result" disabled />
        </div>
      </div>
      <div class="col-6">
        <div class="input-group mb-3">
          <div class="input-group-prepend">
            <span class="input-group-text">Profit</span>
          </div>
          <input
            type="number"
            class="form-control"
            v-model="betProfit"
            disabled
          />
        </div>
      </div>
    </div>

    <div class="row text-center">
      <div class="col-6">
        <div v-if="isLoading" class="spinner-border text-primary mb-3"></div>
        <button
          v-else
          type="button"
          class="btn btn-success mb-3"
          @click="roll(0)"
        >
          Bet Under
        </button>
      </div>
      <div class="col-6">
        <div v-if="isLoading" class="spinner-border text-primary mb-3"></div>
        <button
          v-else
          type="button"
          class="btn btn-danger mb-3"
          @click="roll(1)"
        >
          Bet Over
        </button>
      </div>
    </div>

    <div class="table-responsive-sm">
      <table class="table table-striped text-center">
        <thead>
          <th>Time</th>
          <th>Amount</th>
          <th>Target</th>
          <th>Result</th>
          <th>Profit</th>
        </thead>
        <tbody id="history">
          <tr
            v-for="bet in betList"
            :key="bet._id"
            v-bind:class="{
              'text-success': bet.win == true,
              'text-danger': bet.win == false,
            }"
          >
            <td>{{ moment(bet.time).fromNow() }}</td>
            <td>{{ bet.betAmount.toFixed(6) }}</td>
            <td>
              {{ bet.direction == "under" ? "less than" : "more than" }}
              {{ bet.prediction }}
            </td>
            <td>{{ bet.result.toFixed(2) }}</td>
            <td>{{ bet.profit.toFixed(6) }}</td>
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
      userName: "",
      balance: 0,
      betAmount: 0.000001,
      betProfit: 0,
      wagered: 0,
      profit: 0,
      prediction: 50.49,
      direction: "",
      clientSeed: "",
      result: 0,
      bets: 0,
      wins: 0,
      losses: 0,
      betList: [],
    };
  },
  mounted: function () {
    this.userName = localStorage.getItem("userName");
    this.fetchProfile();
    this.fetchDeposit();
    this.fetchBets();
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
        this.profit = data.data.profit;
        this.wagered = data.data.wagered;
        this.bets = data.data.bets;
        this.wins = data.data.wins;
        this.losses = data.data.losses;
      });
    },
    fetchDeposit: function () {
      axios({
        url: API_URL + "/deposit",
        method: "POST",
        headers: {
          Auth: localStorage.getItem("token"),
        },
        data: {
          userName: localStorage.getItem("userName"),
        },
      }).then((response) => {
        let data = response.data;
        // console.log(data);
        if (data.data.change) this.fetchProfile();
      });
    },
    fetchBets: function () {
      axios({
        url: API_URL + "/bets?&userName=" + localStorage.getItem("userName"),
        method: "GET",
      }).then((response) => {
        let data = response.data;
        // console.log(data);
        // if (data.data.docs.length == 0)
        //   return $("#list").html(`¯|_(ツ)_/¯ You don’t have any dice yet`);
        this.betList = data.data.docs;
      });
    },
    changeAmount: function (turn) {
      switch (turn) {
        case 0:
          this.betAmount = 0.000001;
          break;
        case 1:
          this.betAmount *= 2;
          break;
        case 2:
          this.betAmount /= 2;
          break;
        case 3:
          this.betAmount = this.balance.toFixed(6);
          break;
      }
    },
    roll: function (side) {
      this.isLoading = true;
      side == 0 ? (this.direction = "under") : (this.direction = "over");
      axios({
        url: API_URL + "/roll",
        method: "POST",
        headers: {
          Auth: localStorage.getItem("token"),
        },
        data: {
          userName: localStorage.getItem("userName"),
          betAmount: this.betAmount,
          prediction: this.prediction,
          direction: this.direction,
          clientSeed: this.randomString(32),
        },
      }).then((response) => {
        this.isLoading = false;
        let data = response.data;
        // console.log(data);
        if (!data.status) return this.showAlert(data.message, false);
        this.wagered += Number(data.data.betAmount);
        this.result = data.data.result.toFixed(2);
        this.betProfit = data.data.profit.toFixed(6);
        this.balance = data.data.balance;
        this.profit += Number(data.data.profit);
        let target = `${
          data.data.direction == "under" ? "less than" : "more than"
        } ${data.data.prediction}`;
        this.updateHistory(
          data.data.time,
          data.data.betAmount,
          target,
          data.data.result,
          data.data.profit
        );
      });
    },
    updateHistory: function (time, amount, target, result, profit) {
      // console.log(time);
      let history = `<tr class="${
        Number(profit) >= 0 ? "text-success" : "text-danger"
      }">
        <td>${this.moment(time).fromNow()}</td>
        <td>${Number(amount).toFixed(6)}</td>
        <td>${target}</td>
        <td>${result.toFixed(2)}</td>
        <td>${
          Number(profit) >= 0
            ? "+" + Number(profit).toFixed(6)
            : Number(profit).toFixed(6)
        }</td>
    </tr>`;

      $("#history").prepend(history);
      let maxLine = 20;
      if ($("#history > tr").length > maxLine)
        for (let i = 0; i < $("#history > tr").length - maxLine; i++)
          $("#history > tr:last-child").remove();
    },
  },
};
</script>

<style>
</style>