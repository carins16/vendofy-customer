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
                                        :error-messages="customerNameErrors" 
                                        @input="$v.customerName.$touch()" 
                                        @blur="$v.customerName.$touch()" 
                                        required>
                            </v-text-field>
                        </v-flex>
                        <v-flex xs12>
                            <v-btn color="primary" @click="stepper().next()">Next</v-btn>
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
    import { validationMixin } from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'

    export default {
        mixins: [validationMixin],
        validations: {
            customerName: { required }
        },
        props: ['dialog'],
        data: () => ({
            customerName: '',
            e6: 1
        }),
        methods: {
            stepper: function () {
                var self = this;
                return {
                    next: function () {
                        self.$v.$touch()
                        if (!self.$v.$invalid) {
                            self.e6 = 2
                            self.$store.dispatch('sendMessage', { type: "ENROLL_FINGERPRINT" })
                        }
                    }
                }
            },
            closeDialog: function () {
                this.$emit("close-dialog", false) ;
            }
        },
        computed: {
            customerNameErrors () {
                const errors = []
                if (!this.$v.customerName.$dirty) return errors
                !this.$v.customerName.required && errors.push('Your name is required.')
                return errors
            }
        }
    }
</script>

<style>
    .v-stepper{
        box-shadow: none;
    }
</style>
