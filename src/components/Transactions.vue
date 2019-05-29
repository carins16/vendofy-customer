<template>
    <v-layout column>
        <v-flex xs12 ma-4>
            <template v-if="transactions != null && transactions.length > 0">
                <v-list three-line>
                    <template v-for="(trans, index) in transactions">
                        <v-list-tile :key="trans.key" avatar ripple>
                            <v-list-tile-avatar>
                                <v-img :src="trans.pic">
                                    <template v-slot:placeholder>
                                        <v-layout fill-height align-center justify-center ma-0 >
                                            <v-progress-circular size="100" width="20" indeterminate color="grey"></v-progress-circular>
                                        </v-layout>
                                    </template>
                                </v-img>
                            </v-list-tile-avatar>

                            <v-list-tile-content>
                                <v-list-tile-title>
                                    <v-layout row>
                                        <v-flex xs10>
                                            <p class="title font-weight-regular text-no-wrap text-truncate">
                                                ({{ trans.size }}) {{ trans.descrp }}
                                            </p>
                                        </v-flex>
                                    </v-layout>
                                </v-list-tile-title>
                                <v-list-tile-sub-title>
                                    <span class="title font-weight-regular deep-orange--text">
                                        ₱ {{ Number(trans.price).toLocaleString() }}
                                    </span>
                                </v-list-tile-sub-title>
                                <v-list-tile-sub-title>
                                    <span class="grey--text subheading">
                                        {{ trans.dateTrans | moment("ddd, MMM Do YYYY, h:mm A") }}
                                    </span>
                                </v-list-tile-sub-title>
                            </v-list-tile-content>
                            <v-list-tile-action>
                                <v-list-tile-action-text>
                                    <span class="grey--text body-2 font-weight-regular">
                                        {{ trans.dateTrans | moment("from", "now", true) }} ago
                                    </span>
                                </v-list-tile-action-text>
                                <v-spacer></v-spacer>
                            </v-list-tile-action>
                        </v-list-tile>
                        <v-divider :inset="true" v-if="index + 1 < transactions.length" :key="index"></v-divider>
                    </template>
                </v-list>
            </template>
            <!-- No purchase history -->
            <template v-else>
                <div class="text-xs-center py-3">
                    <v-icon size="100">info</v-icon>
                    <div class="subheading">You have no purchase history yet.</div>
                </div>
            </template>
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
                var signedCustomer = this.$store.getters['customers/getSignedCustomer']

                if ((val !== null && val !== undefined) && (signedCustomer !== null && signedCustomer !== undefined)) {
                    this.transactions = val
                } else {
                    this.transactions = null
                }
            }
        }
    }
</script>
