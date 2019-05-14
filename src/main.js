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
  reconnectionDelay: 3000
})

Vue.use(require('vue-moment'));

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    // initialize firebase
    firebase.initializeApp({
      apiKey: "AIzaSyBf1VjLPZpSoptX4uT_6HmbwFfXIldNGIQ",
      authDomain: "vendofy.firebaseapp.com",
      databaseURL: "https://vendofy.firebaseio.com",
      projectId: "vendofy",
      storageBucket: "vendofy.appspot.com",
      messagingSenderId: "1051291964270",
      appId: "1:1051291964270:web:2d3f01f012712a8b"
    })

    firebase.auth().onAuthStateChanged( res => {
      if(res) {
        this.$store.dispatch('authenticated', { uid: res.uid })
      } else {
        this.$store.dispatch('unauthenticated')
      }
    })
    // connectivity to firebase
    // this.$store.dispatch('connectFirebase')
  }
}).$mount('#app')
