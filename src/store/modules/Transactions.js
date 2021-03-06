import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        transactions: null
    },
    mutations: {
        setTransactions(state, payload) {
            state.transactions = payload
        }
    },
    actions: {
        fetchTransactions({rootState, commit}) {
            // get signed customer data
            var customerSigned = rootState.customers.signedCustomer

            if (customerSigned !== null && customerSigned !== undefined) {

                this.unsubscribeTransactions = firebase.firestore().collection('transactions')
                .where("customerKey", "==", customerSigned.key)
                .orderBy("dateTrans", "desc")
                .onSnapshot( querySnapshot => {

                    var transactions = [];

                    querySnapshot.forEach( doc => {
                        if (doc.data().dateTrans !== null && doc.data().dateTrans !== undefined) {
                            transactions.push({
                                key:            doc.id,
                                customerKey:    doc.data().customerKey,
                                dateTrans:      doc.data().dateTrans.seconds,
                                prodKey:        doc.data().prodKey,
                                descrp:         doc.data().descrp,
                                size:           doc.data().size,
                                pic:            doc.data().pic,
                                price:          doc.data().price
                            })
                        }
                    })
                    commit('setTransactions', transactions)
                })
            }
        },
        saveTransaction({rootState}, payload) {
            // get signed customer data
            var customerSigned = rootState.customers.signedCustomer

            if (customerSigned !== null && customerSigned !== undefined) {
                // add to transaction
                firebase.firestore().collection('transactions').add({
                    customerKey:    customerSigned.key,
                    dateTrans:      firebase.firestore.FieldValue.serverTimestamp(),
                    prodKey:        payload.key,
                    descrp:         payload.descrp,
                    size:           payload.size,
                    pic:            payload.pic,
                    price:          payload.price
                }).then ( docRef => {
                    console.log("Transaction written with ID: ", docRef.id);
                }).catch( error => {
                    console.error("Error adding transaction: ", error);
                })

                // decrement customers cash
                firebase.firestore().collection('customers').doc(customerSigned.key).update({
                    credit: firebase.firestore.FieldValue.increment(-payload.price)
                })
                // decrement product qty
                firebase.firestore().collection('products').doc(payload.key).update({
                    qty: firebase.firestore.FieldValue.increment(-1)
                })
            }
        },
        clearTransactions({commit}) {
            commit('setTransactions', null)
        }
    },
    getters: {
        getTransactions: state => {
            return state.transactions
        }
    }
}