<template>
  <v-container fluid ma-0 pa-0>
    <v-layout>
      <v-flex class="side-menu" pa-2>
        <v-btn round large @click.stop="dialog=true">
          <v-icon class="mr-2" color="blue">add</v-icon>새로 만들기
        </v-btn>
        <div style="background: green, width : 100%, height : 100%;"></div>
        <v-dialog max-width="395px" height="180px" v-model="dialog">
          <v-card class="pa-2">
            <v-card-title style="font-size:18px; font-weight:bold">새 프로젝트</v-card-title>
            <v-text-field class="pa-2" autofocus v-model="projectTitle"></v-text-field>
            <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn
                color="blue darken-1"
                small
                flat
                @click="dialog = false; projectTitle = ''"
              >Disagree</v-btn>

              <v-btn color="blue darken-1" small dark @click="createProject">Agree</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <div class="project-right-menu">
          <v-list>
            <v-list-group v-for="(item,i) in category" :key="`item-${i}`" v-model="item.active">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(subItem,i) in item.list" :key="i">
                <v-list-tile-content>
                  <v-list-tile-title>{{subItem.data.name}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </div>
      </v-flex>
      <v-flex>
        <v-layout class="content-layout" wrap style="width:100%" pa-2>
          <v-flex md3 sm6 xs12 v-for=" project in currentProjectList" :key="project.id" pa-1>
            <v-card height="200px">
              <v-img
                height="70%"
                class="card-image"
                :style="{
                backgroundImage : `url(${project.data.imageURL})`}"
              ></v-img>
              <v-card-title class="pa-2" style="display:block">
                <span style="font-weight:bold">{{project.data.name}}</span>
                <br />
                <span style="font-size:12x">관리자 YunJeong Goo</span>
              </v-card-title>
            </v-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './drive.scss';
</style>

<script src="./drive.ts">
</script>


