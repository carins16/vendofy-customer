import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import VueNativeSock from 'vue-native-websocket'
import firebase from 'firebase'

Vue.config.productionTip = false

Vue.use(VueNativeSock, 'ws://192.168.137.100:81', { 
  store: store,
  reconnection: true,
  reconnectionDelay: 1000
})

Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    firebase.initializeApp({
      apiKey: "AIzaSyBf1VjLPZpSoptX4uT_6HmbwFfXIldNGIQ",
      authDomain: "vendofy.firebaseapp.com",
      databaseURL: "https://vendofy.firebaseio.com",
      projectId: "vendofy",
      storageBucket: "vendofy.appspot.com",
      messagingSenderId: "1051291964270",
      appId: "1:1051291964270:web:2d3f01f012712a8b"
    })

    this.$store.dispatch('products/fetchProducts')
    this.$store.dispatch('config/fetchConfig')

    var signedCustomer = this.$store.getters['customers/getSignedCustomer']

    if (signedCustomer != null && signedCustomer != undefined) {
      this.$store.dispatch('customers/fetchCustomers')
      this.$store.dispatch('transactions/fetchTransactions')
    } 
  }
}).$mount('#app')
