<template>
    <v-dialog v-model="dialog" persistent width="400">
        <v-card>
            <v-card-title class="title font-weight-regular">
                Authentication
            </v-card-title>
            <v-divider></v-divider>
            <v-container>
                <v-layout wrap>
                    <v-flex xs12 ml-3 mr-3>
                        <v-text-field prepend-icon="lock" 
                                    label="Password" 
                                    type="password" 
                                    v-model="password" 
                                    :error-messages="passwordErrors"
                                    required 
                                    @input="$v.password.$touch()"
                                    @blur="$v.password.$touch()">
                        </v-text-field>
                        <v-alert v-model="alert" dismissible type="error">
                            {{ errorMsg }}
                        </v-alert>
                    </v-flex>
                </v-layout>
            </v-container>
            <v-divider></v-divider>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn type="submit" color="blue" dark large :loading="loading" @click="onConnect">Connect</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script>
    import { validationMixin } from 'vuelidate'
    import { required } from 'vuelidate/lib/validators'
    export default {
        mixins: [validationMixin],
        validations: {
            password: { required }
        },
        props: ['dialog'],
        data: () => ({
            password: '',
            loading: false,
            alert: false,
            errorMsg: ''
        }),
        computed: {
            passwordErrors () {
                const errors = []
                if (!this.$v.password.$dirty) return errors
                !this.$v.password.required && errors.push('Password is required')
                return errors
            },
            getAuthenticationError() {
                return this.$store.getters.getAuthError
            },
            getAuthenticationStatus() {
                return this.$store.getters.getAuthStatus
            }
        },
        watch: {
            getAuthenticationError(val) {
                this.loading = false
                if (val !== null && val !== undefined) {
                    if (val.code == "auth/wrong-password") {
                        this.alert = true
                        this.errorMsg = "Incorrect password."
                    } else if (val.code == "auth/too-many-requests") {
                        this.alert = true
                        this.errorMsg = "Too many attempts. Try again later"
                    }
                }
            },
            getAuthenticationStatus(val) {
                if (val !== null && val !== undefined) {
                    if (val) {
                        this.password   = '',
                        this.loading    = false,
                        this.alert      = false,
                        this.errorMsg   = ''
                        this.$emit("close-auth")
                    }
                }
            }
        },
        methods: {
            onConnect () {
                this.$v.$touch()
                if (!this.$v.$invalid && this.loading != true) {
                    this.loading = true
                    this.$store.dispatch('authenticate', {email: 'vendofy@gmail.com', password: this.password})
                }
            }
        }
    }
</script>

