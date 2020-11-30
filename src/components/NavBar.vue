<template>
  <nav class="navbar navbar-expand-md bg-dark navbar-dark">
    <!-- Brand -->
    <router-link to="/" class="navbar-brand">
      <img src="/static/logo.svg" /> Free
    </router-link>

    <!-- Toggler/collapsibe Button -->
    <button
      class="navbar-toggler"
      type="button"
      data-toggle="collapse"
      data-target="#collapsibleNavbar"
    >
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Navbar links -->
    <div v-if="login" class="collapse navbar-collapse" id="collapsibleNavbar">
      <ul class="navbar-nav">
        <li class="nav-item">
          <router-link to="/dice" class="nav-link">Dice</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/deposit" class="nav-link">Deposit</router-link>
        </li>
        <li class="nav-item">
          <router-link to="/withdraw" class="nav-link">Withdraw</router-link>
        </li>
        <li class="nav-item">
          <a href="#" class="nav-link" @click="logout">Logout</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data() {
    return {
      login: false,
    };
  },
  mounted: function () {
    localStorage.getItem("token") ? (this.login = true) : (this.login = false);
  },
};
</script>

<style>
</style>