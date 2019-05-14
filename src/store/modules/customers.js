import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        signedCustomer: null
    },
    mutations: {
        setSignedCustomer (state, payload) {
            state.signedCustomer = payload
        }
    },
    actions: {
        registerCustomers ({dispatch}, payload) {
            firebase.firestore().collection('customers').add({
                fid: payload.fid,
                name: payload.name,
                credit: 0,
                regDate: firebase.firestore.FieldValue.serverTimestamp()
            }).then ( docRef => {
                console.log("Customer written with ID: ", docRef.id);
                // pop up successful registration msg
                dispatch('showNotify', "Registration successful. Please press sign-in", { root: true })
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
                        // attach listener for customer data
                        dispatch("fetchCustomers")
                        // attach listener for customer transaction data
                        dispatch('transactions/fetchTransactions', null, { root: true })
                        // pop up welcome msg to customer signed in
                        dispatch('showNotify', "Welcome, " + doc.data().name, { root: true })
                    }
                })
            })
        },
        signOutCustomer ({dispatch, state, commit}) {

            var customerSigned = state.signedCustomer

            if (customerSigned !== null && customerSigned !== undefined) {
                // pop up goodbye msg to the customer
                dispatch('showNotify', "Goodbye, " + customerSigned.name, { root: true })

                commit('setSignedCustomer', null)
                this.unsubscribeCustomer() // detach customer listener
                this.unsubscribeTransactions() // detach customer transaction listener
            }
        }
    },
    getters: {
        getSignedCustomer: state => {
            return state.signedCustomer
        }
    }
}