<template>
    <v-layout column>
        <v-flex xs12 ma-4>
            <v-list>
                <template v-for="(trans, index) in transactions">
                    <v-list-tile :key="trans.key" avatar>
                        <v-list-tile-avatar>
                            <v-img height="36" :src="trans.pic"></v-img>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title>
                                <p class="title font-weight-regular text-no-wrap text-truncate">
                                    {{ trans.orderedProd }}
                                </p>
                            </v-list-tile-title>
                            <v-list-tile-sub-title>
                                <p class="title font-weight-regular pink--text">
                                    Php {{ trans.price }}
                                </p>
                            </v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                            <span class="grey--text">{{ trans.dateTrans.seconds | moment("MMMM, D YYYY") }}</span>
                            <span class="grey--text">{{ trans.dateTrans.seconds | moment("h:mm A") }}</span>
                        </v-list-tile-action>

                    </v-list-tile>
                    <v-divider v-if="index + 1 < transactions.length" :key="index"></v-divider>
                </template>
            </v-list>
        </v-flex>
    </v-layout>
</template>

<script>
    export default {
        data: () => ({
            transactions: null
        }),
        computed: {
            getTransactions() {
                return this.$store.getters['transactions/getTransactions']
            }
        },
        watch: {
            getTransactions(val) {
                var signedCustomer = JSON.parse(localStorage.getItem('signedCustomer'))

                if ((val !== null && val !== undefined) && (signedCustomer !== null && signedCustomer !== undefined)) {
                    var trans = []
                    val.forEach( t => {
                        if (t.customerKey == signedCustomer.key) {
                            if (t.dateTrans !== null && t.dateTrans !== undefined) trans.push(t)
                        }
                    })

                    this.transactions = trans
                }
            }
        }
    }
</script>
