<template>
  <div class="container p-4">
    <div class="row">
      <div class="col-12">
        <h2 class="text-primary">{{ userName }}</h2>
      </div>

      <div class="col-12 mb-3">
        <h4 class="mb-3">{{ balance.toFixed(6) }} TRX</h4>
        <div v-if="isLoading" class="spinner-border text-primary mb-3"></div>
        <button
          v-else
          type="button"
          class="btn btn-primary mb-3"
          @click="claim"
        >
          Claim TRON
        </button>
        <p>
          Claim free TRON every hours.
          {{ nextTime }} can claim
        </p>
      </div>

      <div class="col-12 mb-3">
        <table class="table table-striped text-center">
          <thead>
            <tr class="text-primary">
              <th>Lucky number</th>
              <th>Prize</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0 - 9885</td>
              <td>0.1000000</td>
            </tr>
            <tr>
              <td>9886 - 9985</td>
              <td>1.000000</td>
            </tr>
            <tr>
              <td>9986 - 9993</td>
              <td>10.000000</td>
            </tr>
            <tr>
              <td>9994 - 9997</td>
              <td>100.000000</td>
            </tr>
            <tr>
              <td>9998 - 9999</td>
              <td>1,000.000000 TRX</td>
            </tr>
            <tr>
              <td>10000</td>
              <td>10,000.000000 TRX</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="col-12 mb-3 text-center">
        <router-link to="/dice">
          Why not try to multiply your TRON up 99.98 times by playing a provably
          fair Dice game!
        </router-link>
      </div>
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
      nextTime: Date.now(),
    };
  },
  mounted: function () {
    this.userName = localStorage.getItem("userName");
    this.fetchProfile();
    this.check();
  },
  methods: {
    fetchProfile: function () {
      axios({
        url: API_URL + "/profile?userName=" + localStorage.getItem("userName"),
        method: "GET",
      })
        .then((response) => {
          let data = response.data;
          // console.log(data);
          this.balance = data.data.balance;
        })
        .catch(() => {
          this.logout();
        });
    },
    check: function () {
      axios({
        url: API_URL + "/check",
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
        data.data.nextTime < Date.now()
          ? (this.nextTime = "Now")
          : (this.nextTime = this.moment(data.data.nextTime).calendar());
      });
    },
    claim: function () {
      this.isLoading = true;
      axios({
        url: API_URL + "/claim",
        method: "POST",
        headers: {
          Auth: localStorage.getItem("token"),
        },
        data: {
          userName: localStorage.getItem("userName"),
        },
      }).then((response) => {
        this.isLoading = false;
        let data = response.data;
        // console.log(data);
        if (!data.status) return this.showAlert(data.message, false);
        this.showAlert(
          `Lucky number is ${data.data.result}, you got ${data.data.prize} TRX, check it at deposit list`
        );
        this.fetchProfile();
        this.check();
      });
    },
  },
};
</script>

<style>
</style>