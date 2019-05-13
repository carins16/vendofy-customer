import Vue from 'vue'
import Vuex from 'vuex'
import customers from './modules/customers'
import products from './modules/products'
import cart from './modules/cart'
import transactions from './modules/transactions'
import config from './modules/config'
import firebase from 'firebase'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    customers,
    products,
    cart,
    transactions,
    config
  },
  state: {
    socket: {
      isConnected: false,
      message: '',
      reconnectError: false,
    },
    notify: '',

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
      state.socket.message = JSON.parse(message.data)
    },
    // mutations for reconnect methods
    SOCKET_RECONNECT(state, count) {
      console.info(state, count)
    },
    SOCKET_RECONNECT_ERROR(state) {
      state.socket.reconnectError = true
    },
    setNotify(state, msg) {
      state.notify = msg
    }
  },
  actions: {
    sendMessage ({state}, payload) {
      console.log(payload)
      if(state.socket.isConnected) {
        Vue.prototype.$socket.send(JSON.stringify(payload))
      }
    },
    showNotify ({commit}, msg) {
      commit('setNotify', msg)
    },
    firebaseConnection () {
      // ref for connection status and last seen online
      var myConnectionsRef = firebase.database().ref('vm/connection')
      var lastOnlineRef = firebase.database().ref('vm/lastOnline')

      firebase.database().ref(".info/connected").on("value", snap => {
        if (snap.val() === true) {
          // when connected or reconnected, set connection to true
          myConnectionsRef.set(true)
          lastOnlineRef.set('') // set null if connected

          // set connection to false when disconnected
          myConnectionsRef.onDisconnect().set(false)
          // when disconnected, update the last time that vending machine was seen online
          lastOnlineRef.onDisconnect().set(firebase.database.ServerValue.TIMESTAMP)

          console.log("Connected!")

        } else {
          console.log("Disconnected!")
        }
      })

    }
  },
  getters: {
    getMessage: state => {
      return state.socket.message
    },
    getConnection: state => {
      return state.socket.isConnected
    },
    getNotify: state => {
      return state.notify
    }
  }
})
