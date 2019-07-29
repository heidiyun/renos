<template>
  <v-container fluid ma-0 pa-0 @click="selected = ''" style="overflow-y:auto; height:100vh;">
    <div class="pin-project-container" style="width: 100%;">
      <div class="content-toolbar" style="padding: 0px 36px;" @click="clickToolbar">
        <div class="content-title">즐겨찾기</div>

        <v-spacer></v-spacer>
        <div class="show-more-button" id="show-more-button" @click="showAll = !showAll">
          {{showAll? '접기' : '더보기'}}
          <v-icon v-if="!showAll" small>expand_more</v-icon>
          <v-icon v-else small>expand_less</v-icon>
        </div>
      </div>
      <div
        class="content-layout"
        id="pin-project-layout"
        :show="!showAll"
        :style="{height:pinContainerHeight}"
      >
        <v-layout wrap px-5 pb-4>
          <v-flex
            class="project-card-container"
            xl3
            lg3
            md4
            sm6
            xs12
            v-for=" (project,i) in currentPinnedProjectList"
            :key="i"
          >
            <div style=" height:100%;" @click.stop="selected = project.id">
              <project-card
                :project="project"
                :selected="selected === project.id"
                @show-progress-bar="showProgressbar"
                @show-more-menu="showMoreMenu"
                @go-project="goToProject"
                class="project-card"
              ></project-card>
            </div>
          </v-flex>
        </v-layout>
      </div>
    </div>

    <div class="all-project-container" style="width:100%; padding-bottom:52px;">
      <div class="content-toolbar" style="padding:36px;" @click="clickToolbar">
        <div class="content-title">내 프로젝트</div>

        <v-spacer></v-spacer>
        <a-input-search
          placeholder="input search text"
          v-model="inputModel"
          @keyup.enter="onSearch"
          @blur="onSearch"
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
      </div>
      <v-layout class="content-layout" px-5 pb-5 wrap style="width:100%;">
        <v-flex
          class="project-card-container"
          xl3
          lg3
          md4
          sm6
          xs12
          v-for=" (project,i) in currentProjectList"
          :key="i"
        >
          <div style="height:100%;" @click.stop="selected = project.id">
            <project-card
              :project="project"
              :selected="selected === project.id"
              @show-progress-bar="showProgressbar"
              @show-more-menu="showMoreMenu"
              @go-project="goToProject"
              class="project-card"
            ></project-card>
          </div>
        </v-flex>
      </v-layout>
    </div>
  </v-container>
</template>

<style lang="scss" scoped>
@import './project.scss';
</style>

<script src="./project.ts">
</script>


