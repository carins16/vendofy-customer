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
    authentication: {
      isAuthenticated: (localStorage.getItem('auth') !== null)? true : false,
      authKey: localStorage.getItem('auth'),
      authError: null
    },
    firebaseIsConnected: false,
    notify: ''
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
    },
    setFirebaseConnection(state, status) {
      state.firebaseIsConnected = status
    },
    setAuthError (state, err) {
      state.authentication.authError = err
    },
    setAuthOK (state, payload) {
      state.authentication.isAuthenticated = payload.status
      state.authentication.authKey = payload.uid
      console.log(payload)
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
    connectFirebase ({commit}) {
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

          commit('setFirebaseConnection', true)
          console.log("Connected!")
        } else {
          commit('setFirebaseConnection', false)
          console.log("Disconnected!")
        }
      })
    },
    authenticate ({commit}, payload) {
      // authenticate the vending machine
      firebase.auth().signInWithEmailAndPassword(
        payload.email,
        payload.password
      ).then( res => {
        // store auth in localstorage
        localStorage.setItem('auth', res.user.uid)
      }).catch(err => {
        // set authentication error and return error message
        commit('setAuthError', err)
      })
    },
    authenticated ({dispatch, commit}, payload) {
      // set authentication as successful
      commit('setAuthOK', {
        uid: payload.uid,
        status: true
      })
      dispatch('showNotify', "Vendofy successfully authenticated.", { root: true })
      // connectivity to firebase
      dispatch('connectFirebase')
      // fetch products and initial config
      dispatch('products/fetchProducts', null, { root: true })
      dispatch('config/fetchConfig', null, { root: true })
    },
    unauthenticated({commit}) {
      firebase.auth().signOut().then(() => {
        commit('setAuthOK', {
          uid: null,
          status: false
        })
        localStorage.removeItem('auth')
      }).catch(error => {
        console.log(error)
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
    },
    getFirebaseConnection: state => {
      return state.firebaseIsConnected
    },
    getAuthError: state => {
      return state.authentication.authError
    },
    getAuthStatus: state => {
      return state.authentication.isAuthenticated
    }
  }
})
