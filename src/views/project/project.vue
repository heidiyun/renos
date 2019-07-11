<template>
  <v-container fluid ma-0 pa-0 @click="selected = ''">
    <div class="content-toolbar" style="padding:36px;" @click="clickToolbar">
      <div class="content-title">내 프로젝트</div>

      <!-- <div class="searchbar">
        <v-text-field color="gray" clearable solo flat box></v-text-field>
      </div>-->
      <v-spacer></v-spacer>
      <a-input-search
        placeholder="input search text"
        v-model="inputModel"
        @keyup="onSearch"
        style="width: 200px;"
      />

      <div>
        <a-select
          defaultValue="all"
          @change="name => filterSelected = name"
          style="width: 120px; padding-left:8px;"
        >
          <a-select-option value="all">전체</a-select-option>
          <a-select-option value="supervisor">관리자</a-select-option>
          <a-select-option value="editor">편집자</a-select-option>
          <a-select-option value="viewer">뷰어</a-select-option>
        </a-select>
      </div>
      <!-- <div>
        <a-select defaultValue="name" small style="width: 120px; padding-left:8px;">
          <a-select-option value="name">이름</a-select-option>
          <a-select-option value="time">시간</a-select-option>
        </a-select>
      </div>-->

      <!-- <div class="content-filter">
        <v-select
          flat
          :items="currentUICategoriesNames"
          placeholder="전체"
          item-value="name"
          dense
          @change="name => filterSelected = name"
          color="blue"
          style="width:90px; height:40px; font-size:12px; "
      ></v-select>-->
      <!-- <div
          class="filter-menu"
          v-for="item in ui.categories"
          :key="`item-${item.name}`"
          @click="filterSelected = item.name"
          :selected="filterSelected === item.name"
        >
          {{item.name}}
          <span v-if="item.name !== '뷰어'">|&nbsp;</span>
      </div>-->
      <!-- </div> -->
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
      >
        <div style="height:100%;" @click.stop="selected = project.id">
          <project-card
            :project="project"
            :selected="selected === project.id"
            @show-progress-bar="showProgressbar"
            @show-more-menu="showMoreMenu"
            class="project-card"
          ></project-card>
        </div>

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


