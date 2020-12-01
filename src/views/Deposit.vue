<template>
  <div class="container p-4">
    <label>Deposit address</label>
    <div class="input-group mb-3">
      <input type="text" class="form-control" v-model="address" />
      <div class="input-group-append">
        <button
          type="button"
          class="btn btn-primary mb-3"
          v-clipboard="() => address"
          v-clipboard:success="clipboardSuccess"
          v-clipboard:error="clipboardError"
        >
          Copy
        </button>
      </div>
    </div>

    <div class="table-responsive-sm" id="list">
      <table class="table table-striped text-center">
        <thead>
          <th>Time</th>
          <th>Amount</th>
        </thead>
        <tbody>
          <tr class="text-success" v-for="dep in depList" :key="dep._id">
            <td>{{ moment(dep.time).fromNow() }}</td>
            <td>+{{ dep.amount.toFixed(6) }}</td>
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
      address: "",
      depList: [],
    };
  },
  mounted: function () {
    this.fetchProfile();
    this.fetchDeposit();
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
          this.address = data.data.address;
        })
        .catch(() => {
          this.logout();
        });
    },
    fetchDeposit: function () {
      axios({
        url: API_URL + "/deposit?userName=" + localStorage.getItem("userName"),
        method: "GET",
      }).then((response) => {
        let data = response.data;
        // console.log(data);
        if (data.data.docs.length == 0)
          return $("#list").html(
            `<p class="text-center">¯|_(ツ)_/¯ You don’t have any deposit yet</p>`
          );
        this.depList = data.data.docs;
      });
    },
  },
};
</script>

<style>
</style>