import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        products: null
    },
    mutations: {
        setProducts (state, payload) {
            state.products = payload
        },
        decreaseQty (state, index) {
            state.products[index].qty--
        },
        incrementQty (state, index) {
            state.products[index].qty++
        }
    },
    actions: {
        fetchProducts({commit}) {

            firebase.firestore().collection('products').orderBy('id', 'asc')
            .onSnapshot( querySnapshot => {

                var products = [];

                querySnapshot.forEach( doc => {
                    products.push({
                        key:    doc.id,
                        id:     doc.data().id,
                        descrp: doc.data().descrp,
                        size:   doc.data().size,
                        price:  doc.data().price,
                        qty:    doc.data().qty,
                        pic:    doc.data().pic
                    })
                });

                commit('setProducts', products)
            });
        },
        decrementQty({commit}, index) {
            commit('decreaseQty', index)
        },
        incrementQty({commit}, index) {
            commit('incrementQty', index)
        }
    },
    getters: {
        getProducts: state => {
            return state.products
        }
    }
}