<template>
  <div class="container p-4">
    <div class="form-group">
      <label>User name</label>
      <input type="text" class="form-control" v-model="userName" />
    </div>
    <div class="form-group">
      <label>Password</label>
      <input type="password" class="form-control" v-model="password" />
    </div>
    <div class="form-group">
      <label>Re-type password</label>
      <input type="password" class="form-control" />
    </div>
    <button type="button" class="btn btn-primary mb-3" @click="register">
      Join now
    </button>
    <br />
    You have account? <router-link to="/login"> Login </router-link>
  </div>
</template>

<script>
import axios from "axios";
import API_URL from "@/utils/apiUrl";

export default {
  data() {
    return {
      userName: "",
      password: "",
    };
  },
  mounted: function () {},
  methods: {
    register: function () {
      axios({
        url: API_URL + "/register",
        method: "POST",
        data: {
          userName: this.userName,
          password: this.password,
        },
      })
        .then((response) => {
          let data = response.data;
          if (!data.status) return this.showAlert(data.message, false);
          localStorage.setItem("userName", this.userName);
          localStorage.setItem("token", data.data.token);
          window.location.href = "/";
        })
        .catch((error) => {
          console.error("ERROR:", error);
        });
    },
  },
};
</script>

<style>
</style>