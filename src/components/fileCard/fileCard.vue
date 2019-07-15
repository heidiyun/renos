<template>
  <v-card class="c-layout round"
          flat
          height="100%">
    <a-dropdown :trigger="['click']">
      <v-btn icon
             small
             class="more-icon">
        <v-icon small
                color="white">more_vert</v-icon>
      </v-btn>
      <a-menu slot="overlay">
        <a-menu-item key="0"
                     @click="onDelete">삭제</a-menu-item>
      </a-menu>
    </a-dropdown>
    <div style="height:calc(100% - 64px); border-bottom : solid 1px rgba(0,0,0,0.1);">
      <v-img height="100%"
             class="card-image"
             v-if="fileIcon.tag === 'image'"
             :src="file.data.fileURL">

      </v-img>

      <div style="height:100%; display:flex; justify-content:center; align-items:center;">
        <a-icon style="font-size : 60px; opacity : 0.8;"
                :type="fileIcon.icon"></a-icon>
      </div>
    </div>
    <v-card-title class="px-3 py-2 text-wrap"
                  style=" height:64px;">
      <div style="width:100%; "
           class="card-text-layout">
        <div style="display:flex;"
             class="pb-1">

          <div class="mr-2">
            <span class='file-type'
                  :style="{background : fileIcon.color}">{{fileIcon.tag}}
            </span>
          </div>
          <div class="card-title"
               style="font-weight:bold">{{file.data.name}}</div>
        </div>

        <div style="font-size:13px;"
             class="pl-1">
          Yunjeong Goo
        </div>

      </div>
    </v-card-title>
  </v-card>
</template>

<style lang="scss" scoped>
@import './fileCard.scss';
</style>

<script src="./fileCard.ts">
</script>


