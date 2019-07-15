<template>
  <v-app>
    <v-navigation-drawer app
                         floating
                         :temporary="$route.name === 'myprojects'"
                         :permanent="$route.name !== 'myprojects'"
                         width="230px;"
                         style="overflow:hidden;"
                         v-if="$route.name !== 'login'">
      <v-flex class="side-menu"
              pt-3
              pl-4>
        <div class="logo-container">
          <span class="logo"
                @click="$router.push('/myprojects')">RENOS</span>
        </div>
        <v-btn large
               @click.stop="uploadFile"
               dark
               color="blue">
          <v-icon class="mr-2 ml-0"
                  color="white">add</v-icon>파일 업로드
        </v-btn>
      </v-flex>
    </v-navigation-drawer>
    <v-toolbar app
               color="white"
               flat
               height="90px;">
      <!-- <v-toolbar-title class="headline text-uppercase">RENOS</v-toolbar-title> -->

      <!-- <a-select class="ml-3" defaultValue="all" style="width: 120px;">
        <a-select-option value="all">전체</a-select-option>
        <a-select-option v-for="(project,i) in projectList " :key="i">{{project.data.name}}</a-select-option>
      </a-select>-->

      <v-select solo
                flat
                v-if="$route.name !== 'myprojects'"
                :items="projectList"
                item-text="data.name"
                item-value="id"
                :label="currentProject"
                @change="onHandleChange"
                style="max-width :fit-content;">
        <template v-slot:prepend-item>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title class="select-all-tile"
                                 @click="$router.push('/myprojects')">모든 프로젝트 보기</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="mt-2"></v-divider>
        </template>
      </v-select>

      <v-spacer></v-spacer>

      <v-btn @click.stop="createProject"
             dark
             color="blue"
             round
             v-if="$route.name==='myprojects'"
             class="mr-5">
        <v-icon class="mr-2 ml-0"
                color="white">add</v-icon>프로젝트 생성
      </v-btn>

      <opener ref="opener"
              @state="state => profileButtonClicked = state">
        <v-btn flat
               icon
               class="profile"
               :ripple="false"
               target="_blank"
               v-if="$route.name !== 'login'"
               :style="{backgroundImage : $store.getters.user ? `url(${$store.getters.user.data.photoURL})` : ''}"
               @click.stop="$refs.opener.open"></v-btn>
        <profile-card v-if="profileButtonClicked"
                      @close="profileButtonClicked  = false"></profile-card>
      </opener>
    </v-toolbar>
    <v-snackbar v-model="snackbar"
                bottom
                left
                :timeout="Number(6000)">
      {{snackbarText}}
      <v-btn color="gray"
             icon
             small
             flat
             @click="snackbar = false">
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
