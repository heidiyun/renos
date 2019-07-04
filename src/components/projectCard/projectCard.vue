<template>
  <v-card class="c-layout" style="width : 100%" height="100%" @dblclick="goToProject">
    <v-img
      height="calc(100% - 64px)"
      class="card-image"
      src="http://www.mdaily.net/news/photo/201907/22828_28511_452.jpg"
    ></v-img>

    <v-img height="calc(100% - 64px)" class="card-image" :src="project.data.fileURL"></v-img>
    <v-card-title class="px-3 py-2" style=" height:64px;">
      <div style="width:100%" class="card-text-layout">
        <div class="card-title" style="font-weight:bold">{{project.data.name}}</div>
        <div style="font-size:12px">관리자 {{owner.data.name}}</div>
      </div>
    </v-card-title>
  </v-card>
</template>

<script src="./projectCard.ts">
</script>

<style lang="scss" scoped>
@import './projectCard.scss';
</style>

