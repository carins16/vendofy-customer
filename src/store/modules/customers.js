import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        customers: null,
        signed: null
    },
    mutations: {
        setCustomers (state, payload) {
            state.customers = payload
        },
        setSigned (state, payload) {
            state.signed = payload
        }
    },
    actions: {
        registerCustomers (context, payload) {
            firebase.firestore().collection('customers').add({
                fid: payload.fid,
                name: payload.name,
                regDate: firebase.firestore.FieldValue.serverTimestamp()
            }).then ( docRef => {
                console.log("Customer written with ID: ", docRef.id);
            }).catch( error => {
                console.error("Error adding customer: ", error);
            })
        },
        fetchCustomers ({commit}) {
            firebase.firestore().collection('customers').orderBy('fid', 'asc')
            .onSnapshot( querySnapshot => {

                var customers = [];

                querySnapshot.forEach( doc => {
                    customers.push(doc.data())
                });

                commit('setCustomers', customers)
            });
        },
        signInCustomers ({state, commit}, payload) {

            state.customers.forEach( cust => {
                
                if (payload.fid == cust.fid) {
                    console.log(cust.fid)
                    commit('setSigned', {
                        fid: cust.fid,
                        name: cust.name
                    })
                }
            })
        }
    },
    getters: {
        getSigned: state => {
            return state.signed
        }
    }
}