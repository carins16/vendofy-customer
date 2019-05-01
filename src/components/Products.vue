<template>
    <v-layout row wrap>
        <v-flex xs6 pa-3 v-for="(product, index) in products" :key="index">
            <v-card>
                <v-img height="200" :src="product.pic"></v-img>
                <v-card-text>
                    <p class="title font-weight-medium pink--text mb-2">Php {{ product.price }}</p>
                    <p class="title font-weight-bold blue--text mb-2 text-no-wrap text-truncate">{{ product.descrp }}</p>
                    <v-layout row>
                        <v-flex xs6>
                            <p class="subheading font-weight-medium blue-grey--text mb-2">Size ({{ product.size }})</p>
                        </v-flex>
                        <v-flex xs6>
                            <p class="subheading font-weight-medium blue-grey--text mb-2 text-xs-right">Quantity: {{ product.qty }}</p>
                        </v-flex>
                    </v-layout>     
                    <v-btn color="orange" block round class="white--text" @click="addToCart(product, index)" 
                        :disabled="product.qty <= 0 || (customerIsSigned == null && customerIsSigned == undefined)">
                        <span v-if="product.qty > 0">Add to Cart</span>
                        <span v-else>Unavailable</span>
                    </v-btn>               
                </v-card-text>
            </v-card>
        </v-flex>
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

