<template>
  <v-card
    class="c-layout"
    flat
    height="100%"
    @dblclick="goToProject"
    :selected="selected === project.id"
  >
    <!-- <progress-mini></progress-mini> -->
    <v-img height="calc(100% - 64px)" class="card-image" :src="project.data.imageURL"></v-img>
    <v-card-title style="display:flex; padding-left:16px;  padding-right:0px; height:64px;">
      <div style="width:85%;" class="card-text-layout">
        <div class="card-title" style="font-weight:bold">{{project.data.name}}</div>
        <div class="card-title-supervisor" style="font-size:12px">관리자 {{owner.data.name}}</div>
        <slot></slot>
      </div>

      <div class="more-icon">
        <v-icon small @click.stop="$refs.opener.open">more_vert</v-icon>
        <opener ref="opener" @state="state => moreMenuClicked = state">
          <v-list class="project-more-menu" v-if="moreMenuClicked">
            <v-list-tile>
              <v-list-tile-title @click="removeDialog=true">삭제</v-list-tile-title>
            </v-list-tile>

            <v-list-tile>
              <v-list-tile-title @click="renameDialog=true">이름 변경</v-list-tile-title>
            </v-list-tile>
            <v-list-tile>
              <v-list-tile-title @click="changeMainImage">이미지 변경</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="!project.data.pin">
              <v-list-tile-title @click="pinnedProject">즐겨찾기 추가</v-list-tile-title>
            </v-list-tile>
            <v-list-tile v-if="project.data.pin">
              <v-list-tile-title @click="pinnedProject">즐겨찾기 삭제</v-list-tile-title>
            </v-list-tile>
          </v-list>
        </opener>
      </div>
      <v-dialog max-width="395px" height="180px" v-model="removeDialog">
        <v-card class="pa-2">
          <v-card-title style="font-size:18px; font-weight:bold">계속하시겠습니까?</v-card-title>
          <v-card-text>공유 드라이브 '{{project.data.name}}'이(가) 모든 사용자로부터 삭제되며 이 작업은 실행취소할 수 없습니다.</v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn color="blue darken-1" small flat @click="removeDialog = false; ">취소</v-btn>

            <v-btn color="blue darken-1" small dark @click="removeProject">프로젝트 삭제</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog max-width="395px" height="180px" v-model="renameDialog">
        <v-card class="pa-2">
          <v-card-title style="font-size:18px; font-weight:bold">프로젝트 이름 변경</v-card-title>
          <v-text-field class="pa-3" autofocus v-model="projectTitle"></v-text-field>
          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn
              color="blue darken-1"
              small
              flat
              @click="renameDialog = false; projectTitle = ''"
            >취소</v-btn>

            <v-btn color="blue darken-1" small dark @click="renameProjectTitle">이름 변경</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-title>
  </v-card>
</template>

<script src="./projectCard.ts">
</script>

<style lang="scss" scoped>
@import './projectCard.scss';
</style>

