import Vue from 'vue'
import Vuex from 'vuex'
import customers from './modules/customers'
import products from './modules/products'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    customers,
    products
  },
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    }
  },
  mutations:{
    SOCKET_ONOPEN (state, event)  {
      Vue.prototype.$socket = event.currentTarget
      state.socket.isConnected = true
    },
    SOCKET_ONCLOSE (state)  {
      state.socket.isConnected = false
    },
    SOCKET_ONERROR (state, event)  {
      console.error(state, event)
    },
    // default handler called for all methods
    SOCKET_ONMESSAGE (state, message)  {
      console.log(message.data)
      state.socket.message = JSON.parse(message.data)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true;
    },
  },
  actions: {
    sendMessage (context, payload) {
      Vue.prototype.$socket.send(JSON.stringify(payload))
    }
  },
  getters: {
    getMessage: state => {
      return state.socket.message
    }
  }
})
