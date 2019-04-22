<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <!-- Header toolbar -->
            <v-toolbar dark color="green">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Register</v-toolbar-title>
            </v-toolbar>
            <!-- Stepper Form -->
            <v-stepper v-model="e6" vertical>
                <v-stepper-step :complete="e6 > 1" step="1">
                    Customer Name
                </v-stepper-step>
                <v-stepper-content step="1">
                    <v-layout wrap>
                        <v-flex xs12 ml-2 mr-5>
                            <v-text-field label="Enter your name . . ." 
                                        v-model="customerName" 
                                        counter="30"
                                        maxlength="30" 
                                        required>
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn color="primary" @click="e6 = 2">Next</v-btn>
                        </v-flex>
                    </v-layout>
                </v-stepper-content>

                <v-stepper-step :complete="e6 > 2" step="2">
                    Fingerprint
                    <small>(Tap your fingerprint 2x)</small>
                </v-stepper-step>

                <v-stepper-content step="2">
                    <v-layout wrap>
                        <v-flex xs12>
                            <v-icon color="blue-grey" size="100">fingerprint</v-icon>
                            <v-icon color="blue-grey" size="100">fingerprint</v-icon>
                        </v-flex>
                        <v-flex xs12 mt-2>
                            <v-btn color="primary" @click="closeDialog">Continue</v-btn>
                            <v-btn @click="e6 = 1">Back</v-btn>
                        </v-flex>
                    </v-layout>
                </v-stepper-content>
            </v-stepper>
        </v-card>
    </v-dialog>
</template>

<script>
    export default {
        props: ['dialog'],
        data: () => ({
            customerName: '',
            e6: 1
        }),
        methods: {
            closeDialog: function() {
                this.$emit("close-dialog", false) ;
            }
        }
    }
</script>

<style>
    .v-stepper{
        box-shadow: none;
    }
</style>
