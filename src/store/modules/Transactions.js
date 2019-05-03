import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        transactions: null
    },
    mutations: {
        setHistory(state, payload) {
            state.transactions = payload
        }
    },
    actions: {
        fetchTransactions({commit}) {
            firebase.firestore().collection('transactions').orderBy('dateTrans', 'desc')
            .onSnapshot( querySnapshot => {

                var transactions = [];

                querySnapshot.forEach( doc => {
                    transactions.push({
                        key:    doc.id,
                        customerKey:       doc.data().customerKey,
                        dateTrans:      doc.data().dateTrans,
                        orderedProd:    doc.data().orderedProd,
                        pic:            doc.data().pic,
                        price:          doc.data().price
                    })
                });

                commit('setHistory', transactions)
            });
        },
        saveTransaction(context, payload) {
            console.log(payload)

            var customerSigned = JSON.parse(localStorage.getItem('signedCustomer'))

            if (customerSigned !== null && customerSigned !== undefined) {

                firebase.firestore().collection('transactions').add({
                    customerKey: customerSigned.key,
                    dateTrans: firebase.firestore.FieldValue.serverTimestamp(),
                    orderedProd: payload.orderedProd,
                    pic: payload.pic,
                    price: payload.price
                }).then ( docRef => {
                    firebase.firestore().collection('customers').doc(customerSigned.key).update({
                        credit: firebase.firestore.FieldValue.increment(-payload.price)
                    })
                    firebase.firestore().collection('products').doc(payload.key).update({
                        qty: firebase.firestore.FieldValue.increment(-1)
                    })
                    console.log("Transaction written with ID: ", docRef.id);
                }).catch( error => {
                    console.error("Error adding transaction: ", error);
                })
            }
        }
    },
    getters: {
        getTransactions: state => {
            return state.transactions
        }
    }
}