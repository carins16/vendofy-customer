<template>
  <v-app id="inspire">
    <div>
      <!-- Toolbar -->
      <v-toolbar color="green" tabs dark fixed app>
        <v-toolbar-title>Vendofy</v-toolbar-title>
        <v-spacer></v-spacer>

        <template v-if="!isSigned">
          <v-toolbar-items>
              <v-btn class="subheading font-weight-medium" @click="openSignInDialog" dark flat>   
                Sign In
              </v-btn>
              <span class="title font-weight-medium mt-3">|</span>
              <v-btn class="subheading font-weight-medium" @click="regDialog = true" dark flat>   
                Register
              </v-btn>
          </v-toolbar-items>
        </template>
        <template v-else>
          <v-toolbar-items>
            <span class="subheading font-weight-medium mt-3 mr-3">{{ signedCustomer }}</span>
            <span class="title font-weight-medium mt-3">|</span>
            <v-btn class="subheading font-weight-medium" @click="signOutDialog = true" dark flat>Sign Out</v-btn>
          </v-toolbar-items>
        </template>
        <!-- Toolbar tabs header -->
        <template v-slot:extension>
          <v-tabs v-model="tab" fixed-tabs grow color="transparent">
            <!-- Active tab slider indicator -->
            <v-tabs-slider color="yellow"></v-tabs-slider>
            <!-- List of tab items -->
            <v-tab v-for="item in tabItems" :key="item.id">
              <v-icon>{{ item.icon }}</v-icon>
              &nbsp;<span>{{ item.name }}</span>
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>

      <!-- tabs content -->
      <v-tabs-items v-model="tab">
        <v-tab-item key="0">
          <v-card flat class="tab-item-wrapper">
            <products/>
          </v-card>
        </v-tab-item>
        <v-tab-item key="1">
          <v-card flat class="tab-item-wrapper">
            <transactions/>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <!-- floating cart button -->
      <v-btn @click="cartDialog = true" large fab bottom right color="green" dark fixed>
        <v-badge color="orange" right overlap>
          <template v-slot:badge>
            <span class="title">{{getCartCount}}</span>
          </template>
          <v-icon x-large>shopping_cart</v-icon>
        </v-badge>
      </v-btn>

      <v-dialog v-model="signOutDialog" max-width="320">
        <v-card>
          <v-card-title class="headline">Signing Out</v-card-title>

          <v-card-text>
            <span class="subheading font-weight-regular">Are you sure do you want to sign out ?</span>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat="flat" @click="signOut">Yes</v-btn>
            <v-btn color="green darken-1" flat="flat" @click="signOutDialog = false">No</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <register :dialog="regDialog" @close-register='regDialog = false'/>
      <sign-in :dialog="signInDialog" @close-sign-in='signInDialog = false'/>
      <cart :dialog="cartDialog" @close-cart="cartDialog = false"/>

      <v-dialog v-model="reconDialog" persistent width="300">
        <v-card color="green" dark>
          <v-card-text>
            <span class="subheading font-weight-regular">Connecting to vending machine . . .</span>
            <v-progress-linear indeterminate color="white" class="mb-0"></v-progress-linear>
          </v-card-text>
        </v-card>
      </v-dialog>

    </div>
  </v-app>
</template>

<script>
  import Register from '@/components/RegisterDialog'
  import SignIn from '@/components/SignInDialog'
  import Products from '@/components/Products'
  import Transactions from '@/components/Transactions'
  import Cart from '@/components/CartDialog'

  export default {
    components: {
      Register,
      SignIn,
      Products,
      Transactions,
      Cart
    },
    data: () => ({
      regDialog: false,
      signInDialog: false,
      cartDialog: false,
      tab: null,
      tabItems: [
        { id: 1, name: 'Products',  icon: 'business_center'},
        { id: 2, name: 'Purchase History',   icon: 'history'}
      ],
      isSigned: false,
      signedCustomer: null,
      signOutDialog: false,
      reconDialog: true
    }),
    methods: {
      openSignInDialog() {
        this.$store.dispatch('sendMessage', { "type": "VERIFY_FINGERPRINT" })
        this.signInDialog = true
      },
      signOut() {
        this.signOutDialog = false

        this.$store.getters['cart/getCart'].forEach(c => {
          this.$store.dispatch('products/incrementQty', (c.id-1))
        })

        this.$store.dispatch('cart/clearCart')
        this.$store.dispatch('customers/signOutCustomer')
      }
    },
    computed: {
      customerIsSigned() {
        return this.$store.getters['customers/getSignedCustomer']
      },
      getCartCount() {
        return this.$store.getters['cart/getCart'].length
      },
      getAlarmStatus() {
        return this.$store.getters['config/getAlarm']
      },
      getLockStatus() {
        return this.$store.getters['config/getLock']
      },
      getConnectionStatus() {
        return this.$store.getters.getConnection
      },
      getMsg() {
        return this.$store.getters.getMessage
      }
    },
    watch: {
      customerIsSigned(val) {
        if (val !== null && val !== undefined) {
          this.signedCustomer = val.name
          this.isSigned = true
        } else {
          this.isSigned = false
        }
      },
      getAlarmStatus(val) {
        if (val !== null && val !== undefined) {
          if (val == false) {
            this.$store.dispatch('sendMessage', { "type": "ALARM_OFF" })
          }
        }
      },
      getLockStatus(val) {
        if (val !== null && val !== undefined) {
          if (val) {
            this.$store.dispatch('sendMessage', { "type": "LOCK_OFF" })
          } else {
            this.$store.dispatch('sendMessage', { "type": "LOCK_ON" })
          }
        }
      },
      getConnectionStatus(val) {
        if (val !== null && val !== undefined) {
          if (val) {
            this.reconDialog = false
          } else {
            this.reconDialog = true
          }
        }
      },
      getMsg(val) {
        if (val !== null && val !== undefined) {
          if (val.type == "ALARM_ON") {
            this.$store.dispatch('config/updateAlarm', true)
          } else if (val.type == "ALARM_OFF") {
            this.$store.dispatch('config/updateAlarm', false)
          }
        }
      }
    },
    mounted() {
      var val = this.$store.getters['customers/getSignedCustomer']

      if (val !== null && val !== undefined) {
        this.signedCustomer = val.name
        this.isSigned = true
      } else {
        this.isSigned = false
      }
    }
  }
</script>

<style>
  .v-badge__badge {
    height: 32px;
    width: 32px;
  }
  .v-badge--overlap .v-badge__badge {
    top: -18px;
    right: -18px;
  }
  .tab-item-wrapper {
    /* vuetify sets the v-tabs__container height to 48px */
    min-height: 100vh;
    padding-top: 112px;
  }
  .v-tabs__slider {
    height: 4px;
  }
</style>