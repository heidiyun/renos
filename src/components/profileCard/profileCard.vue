<template>
  <div>
    <v-card class="profile-card"
            flat
            color="white">
      <v-layout>
        <v-flex>
          <v-avatar tile
                    size="100">
            <img :src="$store.getters.user.data.photoURL"
                 style="border-radius:50%"
                 alt="Avatar" />
          </v-avatar>
        </v-flex>
        <v-flex px-4
                py-2>
          <div style="font-weight:bold; font-size:15px;">{{$store.getters.user.data.name}}</div>
          <div>{{$store.getters.user.data.email}}</div>
          <v-btn color="blue"
                 small
                 dark
                 style="border-radius : 5px; margin-top:12px;"
                 @click.stop="signOut">Sign Out</v-btn>
        </v-flex>
      </v-layout>
    </v-card>
  </div>
</template>

<style lang="scss" scoped>
@import './profileCard.scss';
</style>

<script src="./profileCard.ts">
</script>


