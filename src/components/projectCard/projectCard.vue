<template>
  <v-card
    class="c-layout box-shadow round hover"
    flat
    height="100%"
    @dblclick.stop="goToProject"
    :selected="selected === project.id"
  >
    <!-- <progress-mini></progress-mini> -->

    <v-img height="calc(100% - 64px)" class="card-image pa-2" :src="project.data.imageURL">
      <div class="more-icon">
        <a-dropdown :trigger="['click']" @click.stop>
          <v-btn icon small style="background:rgba(0,0,0,0.7);">
            <v-icon small color="white">more_vert</v-icon>
          </v-btn>
          <a-menu slot="overlay">
            <a-menu-item key="0" @click="onDelete">삭제</a-menu-item>
            <a-menu-item key="1" @click="renameProjectTitle">이름 변경</a-menu-item>
            <a-menu-item key="3" @click="changeMainImage">이미지 변경</a-menu-item>
            <a-menu-item
              key="4"
              @click="pinnedProject"
            >즐겨찾기 {{project.data.pins[$store.getters.user.id] ? '삭제' : '추가'}}</a-menu-item>
          </a-menu>
        </a-dropdown>
      </div>
    </v-img>
    <v-card-title class="pl-3 card-title-layout" style="display:flex; height:64px;">
      <div style="flex:1">
        <div class="card-title">{{project.data.name}}</div>
        <div class="card-title-supervisor" style="font-size:12px; ">관리자 {{owner.data.name}}</div>
      </div>

      <v-icon
        class="ml-4"
        color="blue"
        size="14"
        @click.stop="pinnedProject"
        v-if="project.data.pins[$store.getters.user.id]"
      >bookmark</v-icon>

      <v-icon
        class="ml-4 bookmark"
        size="14"
        @click.stop="pinnedProject"
        v-if="!project.data.pins[$store.getters.user.id]"
      >bookmark_border</v-icon>
    </v-card-title>
  </v-card>
</template>

<script src="./projectCard.ts">
</script>

<style lang="scss" scoped>
@import './projectCard.scss';
</style>

