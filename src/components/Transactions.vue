<template>
    <v-layout column>
        <v-flex xs12 ma-4>
            <v-list two-line>
                <template v-for="(trans, index) in transactions">
                    <v-list-tile :key="trans.key" avatar ripple style="height: 80px;">
                        <v-list-tile-avatar>
                            <v-img height="36" :src="trans.pic">
                                <template v-slot:placeholder>
                                    <v-layout fill-height align-center justify-center ma-0 >
                                        <v-progress-circular size="100" width="20" indeterminate color="grey"></v-progress-circular>
                                    </v-layout>
                                </template>
                            </v-img>
                        </v-list-tile-avatar>

                        <v-list-tile-content>
                            <v-list-tile-title class="mt-2 mb-1">
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
                                    ₱ {{ trans.price }}
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
