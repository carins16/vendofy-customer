<template>
    <v-app id="inspire">
        <div>
            <!-- Toolbar -->
            <v-toolbar color="green" fixed dark app>
                <v-toolbar-title>Vendofy</v-toolbar-title>
            </v-toolbar>
            <!-- Page content -->
            <v-content>
                <v-container fluid>
                    <v-layout align-center justify-center column fill-height>
                        <v-flex xs12 mt-5>
                            <v-icon color="blue-grey" size="150">fingerprint</v-icon>
                        </v-flex>
                        <v-flex xs12 mt-3>
                            <span class="headline font-weight-medium blue--text">Tap your Finger to Sign In</span>
                        </v-flex>
                        <v-flex xs12 mt-4>
                            <span class="subheading font-weight-medium blue-grey--text">Don't have an Account ?</span>
                        </v-flex>
                        <v-flex xs12 mt-2>
                            <v-btn color="success" large @click="dialog = true">Register</v-btn>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
            
            <register-dialog :dialog="dialog" @close-dialog='dialog = false'/>
        </div>
    </v-app>
</template>

<script>

    import RegisterDialog from '@/components/RegisterDialog'

    export default {
        components: {
            RegisterDialog
        },
        data: () => ({
            dialog: false
        }),
        methods: {
            
        }
    }
</script>

<style>

</style>