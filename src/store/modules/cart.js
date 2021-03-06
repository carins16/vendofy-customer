export default {
    namespaced: true,
    state: {
        cart: []
    },
    mutations: {
        appendToCart (state, payload) {
            state.cart.push(payload)
        },
        removeFromCart (state, index) {
            console.log(index)
            state.cart.splice(index, 1)
        },
        setCart (state, payload) {
            state.cart = payload
        }
    },
    actions: {
        addCart({commit}, payload) {
            var cart = [];

            cart.push({
                id:     payload.id,
                descrp: payload.descrp,
                size:   payload.size,
                price:  payload.price,
                pic:    payload.pic
            })
            commit('appendToCart', payload)
        },
        removeCart({commit}, index) {
            commit('removeFromCart', index)
        },
        clearCart({commit}) {
            commit('setCart', [])
        }
    },
    getters: {
        getCart: state => {
            return state.cart
        },
        getTotal: state => {
            var total = 0;

            if (state.cart != null && state.cart != undefined) {
                state.cart.forEach(c => {
                    total += c.price;
                });
            }

            return total
        }
    }
}