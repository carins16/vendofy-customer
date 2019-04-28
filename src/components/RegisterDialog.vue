<template>
    <div>
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
                        Enroll Fingerprint
                    </v-stepper-step>

                    <v-stepper-content step="2">
                        <v-layout wrap>
                            <v-flex xs12 ml-1>
                                <v-icon color="blue-grey" size="100">fingerprint</v-icon>
                            </v-flex>
                            <v-flex xs12 mt-2>
                                <v-btn color="primary" @click="stepper().next()">Scan</v-btn>
                                <v-btn @click="e6 = 1">Back</v-btn>
                            </v-flex>
                        </v-layout>
                    </v-stepper-content>
                </v-stepper>
            </v-card>
        </v-dialog>
        <v-dialog v-model="dialog2" persistent max-width="290">
            <v-card>
                <v-container fluid>
                    <v-layout align-center justify-center column fill-height>
                        <v-flex xs12 mt-3>
                            <v-progress-circular :rotate="360" :size="100" :width="15" :value="timer" color="blue">
                            <span class="title font-weight-medium">{{ timer/10 }}</span>
                            </v-progress-circular>
                        </v-flex>
                        <v-flex xs12 mt-4 mb-4>
                            <span class="title font-weight-medium" v-bind:class="[msgColor]">
                                <center>{{ msg }}</center>
                            </span>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-card>
        </v-dialog>
    </div>
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
            e6: 1,
            dialog2: false,
            timer: 100,
            msg: 'Please put your finger',
            msgColor: 'blue--text'
        }),
        mounted () {
            setInterval(() => {
                if (this.dialog2 == true) {
                    if (this.timer > 0) {
                        this.timer -= 10
                    }
                }
            }, 1000)
        },
        methods: {
            stepper: function () {
                var self = this;
                return {
                    next: function () {
                        self.$v.$touch()
                        if (!self.$v.$invalid) {
                            self.e6 = 2
                            self.dialog2 = true;
                            self.$store.dispatch('sendMessage', { "type": "ENROLL_FINGERPRINT" })
                        }
                    }
                }
            },
            closeDialog: function () {
                this.$emit("close-register")
            }
        },
        computed: {
            customerNameErrors () {
                const errors = []
                if (!this.$v.customerName.$dirty) return errors
                !this.$v.customerName.required && errors.push('Your name is required.')
                return errors
            },
            getMsg() {
                return this.$store.getters.getMessage
            }
        },
        watch: {
            getMsg(val) {
                if (val !== null && val !== undefined) {
                    if (val.type == "ENROLL_CLOSE") {
                        this.dialog2 = false
                        this.msg = "Please put your finger"
                        this.msgColor = 'blue--text'
                        this.timer = 100
                    } else if (val.type == "ENROLL_INFO") {
                        this.msg = val.msg
                        this.msgColor = 'blue--text'
                        this.timer = 100
                    } else if (val.type == "ENROLL_ERROR") {
                        this.msg = val.msg
                        this.msgColor = 'red--text'
                        this.timer = 100
                    } else if (val.type == "ENROLL_SUCCESS") {
                        this.$store.dispatch('customers/registerCustomers', { fid: val.fid, name: this.customerName })
                        this.dialog2 = false
                        this.msg = "Please put your finger"
                        this.msgColor = 'blue--text'
                        this.timer = 100
                        this.closeDialog()
                    }
                }
            }
        }
    }
</script>

<style>
    .v-stepper{
        box-shadow: none;
    }
</style>
