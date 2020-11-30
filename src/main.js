// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './plugins/v-clipboard'
import './plugins/vue-sweetalert2'
import moment from "moment";

Vue.config.productionTip = false

/* eslint-disable no-new */
Vue.mixin({
  methods: {
    moment: function (time) {
      return moment(time);
    },
    logout: function () {
      localStorage.removeItem('userName')
      localStorage.removeItem('token')
      window.location.href = '/'
    },
    clipboardSuccess: function ({ value, event }) {
      if (value == null) return this.showAlert("Empty value", false);
      this.showAlert("Copy success");
    },
    clipboardError: function ({ value, event }) {
      this.showAlert("Copy fail", false);
    },
    showAlert: function (message, type = true) {
      this.$swal.fire({
        icon: `${type ? "success" : "error"}`,
        title: message,
        showConfirmButton: false,
        timer: 2e3,
      });
    },
    randomString: function (length) {
      let result = ''
      let characters = 'abcdef0123456789'
      let charactersLength = characters.length
      for (let i = 0; i < length; i++) result += characters.charAt(Math.floor(Math.random() * charactersLength))
      return result
    }
  },
})

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})