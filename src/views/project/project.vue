<template>
  <v-container fluid ma-0 pa-0>
    <v-layout>
      <v-flex class="side-menu" pa-2>
        <v-btn round large @click.stop="dialog=true">
          <v-icon class="mr-2" color="blue">add</v-icon>프로젝트 생성
        </v-btn>
        <div style=" width : 100%, height : 100%;"></div>
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
            <v-list-group
              v-for="(item,i) in ui.categories"
              :key="`item-${i}`"
              v-model="item.active"
            >
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-content>
                    <v-list-tile-title>{{item.name}}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </template>

              <v-list-tile v-for="(subItem,i) in categoryGroups[item.dataKey]" :key="i">
                <v-list-tile-content>
                  <v-list-tile-title
                    class="px-3 subitem"
                    style="font-size : 14px; color:gray "
                    @click="goToProject(subItem.id)"
                  >{{subItem.data.name}}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </v-list-group>
          </v-list>
        </div>
      </v-flex>
      <v-flex>
        <v-layout class="content-layout" wrap style="width:100%" pa-2>
          <v-flex
            style="width=325px; height : 250px;"
            md4
            sm6
            xs12
            v-for=" (project,i) in currentProjectList"
            :key="i"
            px-2
            py-3
          >
            <project-card :project="project" class="project-card"></project-card>
          </v-flex>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './project.scss';
</style>

<script src="./project.ts">
</script>


