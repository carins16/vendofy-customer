<template>
  <v-app id="inspire">
    <div>
      <!-- Toolbar -->
      <v-toolbar color="green" tabs dark fixed app>
        <v-toolbar-title>Vendofy</v-toolbar-title>
        <v-spacer></v-spacer>
        <span class="subheading font-weight-medium">Sign In</span>
        &nbsp;&nbsp;
        <span class="subheading font-weight-medium">|</span>
        &nbsp;&nbsp;
        <span class="subheading font-weight-medium" @click="regDialog = true">Register</span> 
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
        <v-tab-item v-for="item in tabItems" :key="item.id">
          <v-card flat class="tab-item-wrapper">
            <v-card-text> {{item.name}} </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>

      <!-- floating cart button -->
      <v-btn large fab bottom right color="green" dark fixed>
        <v-badge color="orange" right overlap>
          <template v-slot:badge>
            <span class="title">3</span>
          </template>
          <v-icon x-large>shopping_cart</v-icon>
        </v-badge>
      </v-btn>

      <register-dialog :dialog="regDialog" @close-dialog='regDialog = false'/>
      <sign-in-dialog :dialog="signInDialog"/>

    </div>
  </v-app>
</template>

<script>
  import RegisterDialog from '@/components/RegisterDialog'
  import SignInDialog from '@/components/SignInDialog'

  export default {
    components: {
      RegisterDialog,
      SignInDialog
    },
    data: () => ({
      regDialog: false,
      signInDialog: false,
      tab: null,
      tabItems: [
        { id: 1, name: 'Products',  icon: 'business_center'},
        { id: 2, name: 'History',   icon: 'history'}
      ]
    })
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