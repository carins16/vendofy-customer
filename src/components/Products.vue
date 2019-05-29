<template>
    <v-layout row wrap>
        <template v-if="products != null">
            <v-flex xs6 pa-3 v-for="(product, index) in products" :key="index">
                <v-card>
                    <v-img height="268" :src="product.pic">
                        <template v-slot:placeholder>
                            <v-layout fill-height align-center justify-center ma-0 >
                                <v-progress-circular size="100" width="20" indeterminate color="grey"></v-progress-circular>
                            </v-layout>
                        </template>
                    </v-img>
                    <v-card-text>
                        <p class="title font-weight-medium deep-orange--text mb-2">₱ {{ Number(product.price).toLocaleString() }}</p>
                        <p class="title font-weight-bold blue--text mb-2 text-no-wrap text-truncate">{{ product.descrp }}</p>
                        <v-layout row>
                            <v-flex xs6>
                                <p class="subheading font-weight-medium blue-grey--text mb-2">Size ({{ product.size }})</p>
                            </v-flex>
                            <v-flex xs6>
                                <p class="subheading font-weight-medium blue-grey--text mb-2 text-xs-right">Quantity: {{ product.qty }}</p>
                            </v-flex>
                        </v-layout>     
                        <v-btn color="deep-orange" large block round class="white--text" @click="addToCart(product, index)" 
                            :disabled="product.qty <= 0 || (customerIsSigned == null && customerIsSigned == undefined)">
                            <span v-if="product.qty > 0">
                                <v-icon>add_shopping_cart</v-icon>&nbsp;Add to Cart
                            </span>
                            <span v-else>Out of Stocks</span>
                        </v-btn>               
                    </v-card-text>
                </v-card>
            </v-flex>
        </template>
    </v-layout>
</template>

<script>
export default {
    data: () => ({
        products: null
    }),
    computed: {
      getProducts() {
        return this.$store.getters['products/getProducts']
      },
      customerIsSigned() {
        return this.$store.getters['customers/getSignedCustomer']
      }
    },
    watch: {
        getProducts(val) {
            if (val !== null && val !== undefined) {
                this.products = val
            }
        }
    },
    methods: {
        addToCart(prod, index) {
            this.$store.dispatch('cart/addCart', prod)
            this.$store.dispatch('products/decrementQty', index)
        }
    }
}
</script>

