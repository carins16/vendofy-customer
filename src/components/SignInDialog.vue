<template>
  <v-layout row justify-center>
    <v-dialog v-model="dialog" persistent max-width="290">
      <v-card>
        
          <v-container fluid>
            <v-layout align-center justify-center column fill-height>
                <v-flex xs12 mt-3>
                    <v-progress-circular :rotate="360" :size="100" :width="15" :value="timer" color="blue">
                      <span class="title font-weight-medium">{{ timer/10 }}</span>
                    </v-progress-circular>
                </v-flex>
                <v-flex xs12 mt-4 mb-4>
                    <span class="title font-weight-medium" v-bind:class="[msgColor]" >
                      <center>{{ msg }}</center>
                    </span>
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
      timer: 100,
      msg: 'Please scan your finger',
      msgColor: 'blue--text'
    }),
    mounted () {
      setInterval(() => {
        if (this.dialog == true) {
          if (this.timer > 0) {
            this.timer -= 10
          }
        }
      }, 1000)
    },
    computed: {
      getMsg() {
        return this.$store.getters.getMessage
      }
    },
    watch: {
      getMsg(val) {

        if (val !== null && val !== undefined) {
          if (val.type == "SIGNIN_CLOSE") {
            this.$emit("close-sign-in")

            this.msg = "Please scan your finger"
            this.msgColor = 'blue--text'
            this.timer = 100
          } else if (val.type == "SIGNIN_ERROR") {
            this.msg = val.msg
            this.msgColor = 'red--text'
            this.timer = 100
          } else if (val.type == "SIGNIN_SUCCESS") {

            this.$store.dispatch('customers/signInCustomers', { fid: val.fid })

            this.$emit("close-sign-in")

            this.msg = "Please scan your finger"
            this.msgColor = 'blue--text'
            this.timer = 100
          }
        }

      }
    }
  }
</script>
