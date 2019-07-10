<template>
  <v-app @click="profileButtonClicked= false">
    <v-navigation-drawer app permanent width="300px;" style="overflow:hidden;">
      <v-flex class="side-menu">
        <div class="logo">RENOS</div>
        <v-btn
          large
          @click.stop="dialog=true"
          color="blue"
          style="margin-left:30px; color:white;"
          v-if="$route.name==='myprojects'"
        >
          <v-icon class="mr-2 ml-0" color="white">add</v-icon>프로젝트 생성
        </v-btn>

        <v-dialog max-width="395px" height="180px" v-model="dialog">
          <v-card class="pa-2">
            <v-card-title style="font-s'ize:18px; font-weight:bold">새 프로젝트</v-card-title>
            <v-text-field class="pa-3" autofocus v-model="projectTitle"></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn color="blue darken-1" small flat @click="dialog = false; projectTitle = ''">취소</v-btn>

              <v-btn color="blue darken-1" small dark @click="createProject">프로젝트 생성</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-navigation-drawer>
    <v-toolbar app color="white" flat height="90px;">
      <v-toolbar-title class="headline text-uppercase"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-btn
        flat
        icon
        class="profile"
        :ripple="false"
        target="_blank"
        v-if="$route.name !== 'login'"
        :style="{backgroundImage : $store.getters.user ? `url(${$store.getters.user.data.photoURL})` : ''}"
        @click.stop="profileButtonClicked ? profileButtonClicked = false : profileButtonClicked =true"
      ></v-btn>
      <v-card class="profile-card" flat color="white" v-if="profileButtonClicked">
        <v-layout>
          <v-flex>
            <v-avatar tile color="green" size="100">
              <img :src="$store.getters.user.data.photoURL" style="border-radius:50%" alt="Avatar" />
            </v-avatar>
          </v-flex>
          <v-flex px-4 py-2>
            <div style="font-weight:bold; font-size:15px;">YunJeong Goo</div>
            <div>heidiyun.goo@gmail.com</div>
            <v-btn
              color="blue"
              small
              dark
              style="border-radius : 5px; margin-top:12px;"
              @click="signOut"
            >Sign Out</v-btn>
          </v-flex>
        </v-layout>
      </v-card>
    </v-toolbar>
    <v-snackbar v-model="snackbar" bottom left :timeout="Number(6000)">
      {{snackbarText}}
      <v-btn color="gray" icon small flat @click="snackbar = false">
        <v-icon small>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<style lang="scss" >
@import './app.scss';
</style>


<script src="./app.ts">
</script>
