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
                        transactions.push({
                            key:            doc.id,
                            customerKey:    doc.data().customerKey,
                            dateTrans:      doc.data().dateTrans,
                            orderedProd:    doc.data().orderedProd,
                            pic:            doc.data().pic,
                            price:          doc.data().price
                        })
                    })
                    console.log(querySnapshot)
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
                    customerKey: customerSigned.key,
                    dateTrans: firebase.firestore.FieldValue.serverTimestamp(),
                    orderedProd: payload.orderedProd,
                    pic: payload.pic,
                    price: payload.price
                }).then ( docRef => {
                    // decrement customers cash
                    firebase.firestore().collection('customers').doc(customerSigned.key).update({
                        credit: firebase.firestore.FieldValue.increment(-payload.price)
                    })
                    // decrement product qty
                    firebase.firestore().collection('products').doc(payload.key).update({
                        qty: firebase.firestore.FieldValue.increment(-1)
                    })
                    console.log("Transaction written with ID: ", docRef.id);
                }).catch( error => {
                    console.error("Error adding transaction: ", error);
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