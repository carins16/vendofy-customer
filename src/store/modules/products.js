import firebase from 'firebase'

export default {
    namespaced: true,
    state: {
        products: null
    },
    mutations: {
        setProducts (state, payload) {
            state.products = payload
        }
    },
    actions: {
        fetchProducts({commit}) {

            firebase.firestore().collection('products').orderBy('id', 'asc')
            .onSnapshot( querySnapshot => {

                var products = [];

                querySnapshot.forEach(function(doc) {
                    products.push(doc.data())
                });

                commit('setProducts', products)
            });
        }
    },
    getters: {

    }
}