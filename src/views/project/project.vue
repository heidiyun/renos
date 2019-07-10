<template>
  <v-container fluid ma-0 pa-0 @click="selected = ''">
    <div class="content-toolbar">
      <div class="content-title">내 프로젝트</div>
      <v-spacer></v-spacer>
      <div class="content-filter">
        <div
          class="filter-menu"
          v-for="item in ui.categories"
          :key="`item-${item.name}`"
          @click="filterSelected = item.name"
          :selected="filterSelected === item.name"
        >
          {{item.name}}
          <span v-if="item.name !== '뷰어'">|&nbsp;</span>
        </div>
      </div>
    </div>
    <v-layout class="content-layout" px-5 pb-5 wrap style="width:100%;">
      <v-flex
        style="height : 370px;"
        xl3
        lg4
        md6
        sm12
        xs12
        v-for=" (project,i) in currentProjectList"
        :key="i"
        px-5
        py-4
        @click.stop="selected = project.id"
      >
        <project-card
          :project="project"
          :selected="selected === project.id"
          @show-progress-bar="showProgressbar"
          @show-more-menu="showMoreMenu"
          class="project-card"
        ></project-card>

        <!-- <progress-bar v-if="selected===project.id" style :showProgressbar="isProgressbar"></progress-bar> -->

        <!-- <v-list class="project-more-menu" v-if="moreMenuClicked && selected === project.id">
              <v-list-tile>
                <v-list-tile-title>삭제</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-title>이름 변경</v-list-tile-title>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-title>이미지 변경</v-list-tile-title>
              </v-list-tile>
        </v-list>-->
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './project.scss';
</style>

<script src="./project.ts">
</script>


