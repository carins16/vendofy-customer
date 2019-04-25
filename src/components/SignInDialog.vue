<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        
          <v-container fluid>
            <v-layout align-center justify-center column fill-height>
                <v-flex xs12 mt-3>
                    <v-icon color="blue-grey" size="120">fingerprint</v-icon>
                </v-flex>
                <v-flex xs12 mt-3 mb-4>
                    <span class="title font-weight-medium blue--text">Please Scan your Finger</span>
                </v-flex>
            </v-layout>
          </v-container>
        
        
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
  export default {
    props: ['dialog'],
    data: () => ({
      timer: 0
    })
  }
</script>
