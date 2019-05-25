<template>
    <div>
        <!-- Cart Dialog -->
        <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
            <v-card>
                <!-- Header toolbar -->
                <v-toolbar dark color="green">
                    <v-btn icon dark large @click="closeCart">
                        <v-icon>arrow_back</v-icon>
                    </v-btn>
                    <v-toolbar-title>Cart</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-toolbar-items>
                        <v-btn type="submit" class="subheading" dark flat large
                                :disabled="getCart.length <= 0" 
                                @click="purchaseNow">   
                            Purchase Now
                        </v-btn>
                    </v-toolbar-items>
                </v-toolbar>

                <v-layout column>
                    <v-flex xs12 ma-4>
                        <v-list>
                            <v-list-tile v-for="(cart, index) in getCart" :key="index" avatar>
                                <v-list-tile-avatar>
                                    <v-img height="36" :src="cart.pic">
                                        <template v-slot:placeholder>
                                            <v-layout fill-height align-center justify-center ma-0 >
                                                <v-progress-circular size="100" width="20" indeterminate color="grey"></v-progress-circular>
                                            </v-layout>
                                        </template>
                                    </v-img>
                                </v-list-tile-avatar>

                                <v-list-tile-content>
                                    <v-list-tile-title>
                                        <p class="title font-weight-regular text-no-wrap text-truncate">
                                            ({{ cart.size }}) {{ cart.descrp }} 
                                        </p>
                                    </v-list-tile-title>
                                    <v-list-tile-sub-title class="mt-1">
                                        <p class="title font-weight-regular deep-orange--text">
                                            ₱ {{ cart.price }}
                                        </p>
                                    </v-list-tile-sub-title>
                                </v-list-tile-content>

                                <v-list-tile-action>
                                    <v-btn icon ripple @click="removeFromCart(cart, index)">
                                        <v-icon color="grey lighten-1">close</v-icon>
                                    </v-btn>
                                </v-list-tile-action>
                            </v-list-tile>

                            <template v-if="getCart.length > 0">
                                <v-divider inset></v-divider>

                                <v-list-tile avatar>
                                    <v-list-tile-avatar></v-list-tile-avatar>
                                    <v-list-tile-content>
                                        <v-list-tile-title>
                                            <p class="title font-weight-bold red--text">
                                                Total: ₱ {{ getTotal }}
                                            </p>
                                        </v-list-tile-title>
                                    </v-list-tile-content>
                                    <v-list-tile-action>
                                        <v-btn color="grey" large flat @click="clearCart">Clear All</v-btn>
                                    </v-list-tile-action>
                                </v-list-tile>
                            </template>

                        </v-list>
                    </v-flex>
                </v-layout>
            </v-card>
        </v-dialog>
        <!-- Currency Dialog -->
        <v-dialog v-model="dialog2" persistent max-width="360">
            <v-card>
                <v-container fluid>
                    <v-layout align-center justify-center column fill-height>
                        <v-flex xs12 mt-3>
                            <center>
                                <span class="display-1 font-weight-bold" v-bind:class="[moneyColor]">
                                    ₱ {{customerCash}}/{{getTotal}}
                                </span>
                            </center>
                        </v-flex>
                        <v-flex xs12 mt-4 mb-4>
                            <span class="headline font-weight-medium blue--text">
                                {{msg}}
                            </span>
                        </v-flex>
                    </v-layout>
                    <v-layout align-center justify-center row>
                        <v-flex xs12 ml-2 mr-2>
                            <v-btn block large color="green" class="white--text" @click="confirm" :disabled="customerCash < getTotal">Confirm</v-btn>
                        </v-flex>
                        <v-flex xs12 ml-2 mr-2>     
                            <v-btn block large color="red" class="white--text" @click="cancel" :disabled="!canClose">
                                <span v-if="value > 0">({{value}})</span>&nbsp;Close
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>

        <v-dialog v-model="dialog3" persistent max-width="360">
            <v-card color="primary" dark>
                <v-card-text>
                    <span class="title font-weight-regular">Processing. . . ({{fallItems}}/{{getCartCount}})</span>
                    <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import { clearInterval } from 'timers';
    export default {
        props: ['dialog'],
        data: () => ({
            dialog2: false,
            dialog3: false,
            customerCash: 0,
            msg: 'Please Insert Bill/Coin',
            moneyColor: 'red--text',
            fallItems: 0,
            canClose: false,
            interval: {},
            value: 0
        }),
        beforeDestroy () {
            clearInterval(this.interval)
        },
        mounted () {
            this.interval = setInterval(() => {
                if (this.value > 0) {
                    this.value--
                }
            }, 1000)
        },
        methods: {
            closeCart: function () {
                this.$emit("close-cart")
            },
            removeFromCart(cart, index) {
                this.$store.dispatch('cart/removeCart', index)
                this.$store.dispatch('products/incrementQty', (cart.id-1))
            },
            purchaseNow() {
                var signedCustomer = this.$store.getters['customers/getSignedCustomer']

                if (signedCustomer !== null && signedCustomer !== undefined) { 
                    // get current cash of customer
                    this.customerCash = signedCustomer.credit

                    this.dialog2 = true
                    this.canClose = false
                    this.value = 3

                    // activate currency acceptors
                    this.$store.dispatch('sendMessage', { "type": "ACTIVATE_BILL_COIN" })

                    // wait 3 sec before enable close
                    setTimeout(() => {
                        this.canClose = true
                        console.log("interval has been cleared.")
                    }, 3000);
                }
            },
            clearCart() {
                // get all items added to cart
                this.$store.getters['cart/getCart'].forEach(c => {
                // roll back items from cart to products
                this.$store.dispatch('products/incrementQty', (c.id-1))
                })

                // clear the cart
                this.$store.dispatch('cart/clearCart')
            },
            confirm() {
                this.dialog2 = false
                this.dialog3 = true

                var items = []
                // save customer purchase to database
                this.$store.getters['cart/getCart'].forEach( c => {
                    items.push(c.id)
                    this.$store.dispatch('transactions/saveTransaction', { 
                        key: c.key,
                        descrp: c.descrp,
                        size: c.size,
                        pic: c.pic,
                        price: c.price
                    })
                })

                // fall all items that has been purchased
                this.$store.dispatch('sendMessage', {   "type": "PURCHASE_ITEMS",
                                                        "size": items.length, 
                                                        "items": items
                                                    })
                // then deactivate currency acceptors
                this.$store.dispatch('sendMessage', { "type": "DEACTIVATE_BILL_COIN" })
            },
            cancel() {
                this.customerCash = 0
                this.dialog2 = false
                // deactivate currency acceptors
                this.$store.dispatch('sendMessage', { "type": "DEACTIVATE_BILL_COIN" })
            }
        },
        computed: {
            getCart() {
                return this.$store.getters['cart/getCart']
            },
            getTotal() {
                return this.$store.getters['cart/getTotal']
            },
            getMsg() {
                return this.$store.getters.getMessage
            },
            getCustomerCash() {
                return this.$store.getters['customers/getSignedCustomer']
            },
            getCartCount() {
                return this.$store.getters['cart/getCart'].length
            }
        },
        watch: {
            getMsg(val) {
                if (val !== null && val !== undefined) {
                    if (val.type == "ADD_CASH") {
                        // update current cash of customer in the database
                        this.canClose = true
                        this.$store.dispatch('customers/addCustomersCash', val.cash)
                    } else if (val.type == "CURRENCY_INFO") {
                        // display realtime received cash
                        if (val.msg !== null && val.msg !== undefined) {
                            if (val.msg > 5) {
                                this.msg = "Adding... ₱" + val.msg
                                this.canClose = false
                            }
                        }
                        console.log(val.msg)
                    } else if (val.type == "FALL_ITEMS") {
                        // +1 if item has been fall
                        this.fallItems++
                    }
                }
            },
            getCustomerCash(val) {
                var signedCustomer = this.$store.getters['customers/getSignedCustomer']

                if ((val !== null && val !== undefined) && (signedCustomer !== null && signedCustomer !== undefined)) {
                    // get current cash of the customer
                    this.customerCash = val.credit
                }
            },
            fallItems(val) {
                if (val >= this.getCartCount) {
                    this.dialog3 = false
                    this.fallItems = 0
                    // if all items has been fall clear the cart & close
                    this.$store.dispatch('cart/clearCart')
                    this.closeCart()
                    // pop up successful transaction msg
                    this.$store.dispatch('showNotify', "Transaction successful. Please see purchase history")
                }
            },
            customerCash (val) {
                if (val < this.getTotal) {
                    this.moneyColor = 'red--text'
                    this.msg = "Please Insert Bill/Coin"
                } else {
                    this.moneyColor = 'green--text'
                    this.msg = "Press confirm to continue."
                }
            }
        }
    }
</script>
