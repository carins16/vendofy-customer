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
                    <span class="title font-weight-medium blue--text">{{ msg }}</span>
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
      msg: 'Please Scan your Finger'
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

        console.log(val)  
        if (val !== null && val !== undefined) {
          if (val.type == "SIGNIN") {
            if (val.status == "CLOSE_SIGN_IN") {
              this.$emit("close-sign-in", false)
              this.timer = 100
            }
          }
        }

      }
    }
  }
</script>
