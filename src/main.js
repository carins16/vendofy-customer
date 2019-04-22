import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
  created() {
    var ws = new WebSocket("ws://192.168.254.11:81");

    ws.onopen = () => {
      console.log("WebSocket Connection has been stablished.")
      var obj = { name: "John", age: 30, city: "New York" }
      var myJSON = JSON.stringify(obj)
      console.log(myJSON)
      ws.send(myJSON)
    }

    ws.onclose = () => {
      console.log("WebSocket Connection has been terminated.")
    }

    ws.onmessage = evt => {
      console.log(evt.data)
    } 


  }
}).$mount('#app')
