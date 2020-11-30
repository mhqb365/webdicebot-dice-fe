<template>
  <div id="app">
    <NavBar />
    <router-view />
    <Bottom />
  </div>
</template>

<script>
import NavBar from "@/components/NavBar";
import Bottom from "@/components/Bottom";

export default {
  name: "App",
  components: {
    NavBar,
    Bottom,
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Petrona&display=swap");

#app {
  font-family: "Petrona", serif;
}
</style>
