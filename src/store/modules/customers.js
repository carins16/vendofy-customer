import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        customers: null,
        signedCustomer: JSON.parse(localStorage.getItem('signedCustomer'))
    },
    mutations: {
        setCustomers (state, payload) {
            state.customers = payload
        },
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
        addCustomersCash (context, cash) {
            var customerSigned = JSON.parse(localStorage.getItem('signedCustomer'))

            if (customerSigned !== null && customerSigned !== undefined) {
                firebase.firestore().collection('customers').doc(customerSigned.key).update({
                    credit: firebase.firestore.FieldValue.increment(cash)
                })
            }
        },
        fetchCustomers ({commit}) {
            firebase.firestore().collection('customers').orderBy('fid', 'asc')
            .onSnapshot( querySnapshot => {

                var customers = [];

                querySnapshot.forEach( doc => {
                    customers.push({
                        key:    doc.id,
                        fid:    doc.data().fid,
                        name:   doc.data().name,
                        regDate:doc.data().regDate,
                        credit:   doc.data().credit
                    })
                });

                commit('setCustomers', customers)
            });
        },
        signInCustomers ({state, commit}, payload) {

            state.customers.forEach( c => {
                if (payload.fid == c.fid) {
                    commit('setSignedCustomer', {
                        key:    c.key,
                        fid:    c.fid,
                        name:   c.name
                    })
                    localStorage.setItem('signedCustomer', JSON.stringify({ 
                        key:    c.key,
                        fid:    c.fid,
                        name:   c.name
                    }))
                }
            })
        },
        signOutCustomer ({commit}) {
            commit('setSignedCustomer', null)
            localStorage.removeItem('signedCustomer')
        }
    },
    getters: {
        getSignedCustomer: state => {
            return state.signedCustomer
        },
        getCustomers: state => {
            return state.customers
        }
    }
}