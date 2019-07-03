<template>
  <v-app>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>RENOS</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        flat
        icon
        class="profile"
        :ripple="false"
        target="_blank"
        v-if="$route.name !== 'login'"
        :style="{backgroundImage : $store.getters.user ? `url(${$store.getters.user.data.photoURL})` : ''}"
      ></v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<style lang="scss" >
@import './app.scss';
</style>


<script src="./app.ts">
fnzm;
</script>
