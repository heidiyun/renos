<template>
  <v-container fluid ma-0 pa-0>
    <v-layout>
      <v-flex class="side-menu" pa-2>
        <v-btn round large @click="uploadFile">
          <v-icon class="mr-2" color="blue">add</v-icon>파일 업로드
        </v-btn>

        <div class="project-right-menu">
          <div class="list-title">members</div>
          <v-list>
            <v-list-tile v-for="member in members" :key="member.id" avatar>
              <v-list-tile-avatar tile>
                <img
                  :src="member.data.photoURL"
                  style="border-radius:50%; width:30px; height : 30px;"
                />
              </v-list-tile-avatar>
              <v-list-tile-content>
                <v-list-tile-title v-text="member.data.name"></v-list-tile-title>
              </v-list-tile-content>
              <v-list-tile-action v-if="isOwner">
                <v-icon small>more_vert</v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list>
        </div>
      </v-flex>
      <v-flex>
        <div class="content-layout">
          <div class="content-top-menu">
            <div class="project-title">{{project.data.name}}</div>
          </div>
          <div class="content"></div>
        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './drive.scss';
</style>

<script src="./drive.ts">
</script>

