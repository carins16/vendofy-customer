import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        signedCustomer: JSON.parse(localStorage.getItem('signedCustomer'))
    },
    mutations: {
        setSignedCustomer (state, payload) {
            state.signedCustomer = payload
        }
    },
    actions: {
        registerCustomers (context, payload) {
            firebase.firestore().collection('customers').add({
                fid: payload.fid,
                name: payload.name,
                credit: 0,
                regDate: firebase.firestore.FieldValue.serverTimestamp()
            }).then ( docRef => {
                console.log("Customer written with ID: ", docRef.id);
            }).catch( error => {
                console.error("Error adding customer: ", error);
            })
        },
        addCustomersCash ({state}, cash) {
            var customerSigned = state.signedCustomer

            if (customerSigned !== null && customerSigned !== undefined) {
                firebase.firestore().collection('customers').doc(customerSigned.key).update({
                    credit: firebase.firestore.FieldValue.increment(cash)
                })
            }
        },
        fetchCustomers ({state, commit}) {
            var customerSigned = state.signedCustomer

            if (customerSigned !== null && customerSigned !== undefined) {
                this.unsubscribeCustomer = firebase.firestore().collection('customers').doc(customerSigned.key)
                .onSnapshot( doc => {
                    // store in vuex state
                    commit('setSignedCustomer', {
                        key:        doc.id,
                        fid:        doc.data().fid,
                        name:       doc.data().name,
                        regDate:    doc.data().regDate,
                        credit:     doc.data().credit
                    })
                    console.log(doc.data())
                })
            }
        },
        signInCustomers ({dispatch, commit}, payload) {

            firebase.firestore().collection('customers').get()
            .then(querySnapshot => {
                querySnapshot.forEach(function(doc) {

                    if (doc.data().fid == payload.fid) {
                        // store in vuex state
                        commit('setSignedCustomer', {
                            key:        doc.id,
                            fid:        doc.data().fid,
                            name:       doc.data().name,
                            regDate:    doc.data().regDate,
                            credit:     doc.data().credit
                        })
                        // store in localstorage
                        localStorage.setItem('signedCustomer', JSON.stringify({ 
                            key:        doc.id,
                            fid:        doc.data().fid,
                            name:       doc.data().name,
                            regDate:    doc.data().regDate,
                            credit:     doc.data().credit
                        }))
                        // attach listener for customer data
                        dispatch("fetchCustomers")
                        // attach listener for customer transaction data
                        dispatch('transactions/fetchTransactions', null, { root: true })
                    }
                })
            })
        },
        signOutCustomer ({commit}) {
            commit('setSignedCustomer', null)
            localStorage.removeItem('signedCustomer')
            this.unsubscribeCustomer() // detach customer listener
            this.unsubscribeTransactions() // detach customer transaction listener
        }
    },
    getters: {
        getSignedCustomer: state => {
            return state.signedCustomer
        }
    }
}