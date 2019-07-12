<template>
  <v-card class="c-layout"
          style="width : 100%"
          height="100%">

    <v-img height="calc(100% - 64px)"
           class="card-image"
           :src="file.data.fileURL"></v-img>
    <v-card-title class="px-3 py-2"
                  style=" height:64px;">
      <div style="width:100%"
           class="card-text-layout">
        <div class="card-title"
             style="font-weight:bold">{{file.data.name}}</div>

      </div>
    </v-card-title>
  </v-card>
</template>

<style lang="scss" scoped>
@import './fileCard.scss';
</style>

<script src="./fileCard.ts">
</script>


