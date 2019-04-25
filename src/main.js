import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store/index'
import './registerServiceWorker'
import VueNativeSock from 'vue-native-websocket'
import firebase from 'firebase'

Vue.config.productionTip = false

Vue.use(VueNativeSock, 'ws://192.168.254.11:81', { 
  store: store,
  reconnection: true,
  reconnectionDelay: 3000
})

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
      messagingSenderId: "1051291964270"
    })

    this.$store.dispatch('products/fetchProducts')
  }
}).$mount('#app')
