<template>
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="dialog-bottom-transition">
        <v-card>
            <v-toolbar dark color="green">
                <v-btn icon dark @click="closeDialog">
                    <v-icon>close</v-icon>
                </v-btn>
                <v-toolbar-title>Register</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn dark flat @click="dialog = false">Save</v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-container fluid>
                <v-layout wrap>
                    <v-flex xs12>
                        <v-card-text>
                            <v-text-field label="Enter your name . . ." 
                                        v-model="customerName" 
                                        counter="30"
                                        maxlength="30" 
                                        required>
                            </v-text-field>
                        </v-card-text>
                    </v-flex>
                </v-layout>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    props: ['dialog'],
    data: () => ({
        customerName: ''
    }),
    methods: {
        closeDialog: function() {
            this.$emit("close-dialog", false) ;
        }
    }
}
</script>
