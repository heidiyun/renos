<template>
  <div class="preview-container" v-if="show">
    <v-layout class="toolbar pa-1">
      <v-btn dark @click="off" icon>
        <v-icon>keyboard_backspace</v-icon>
      </v-btn>
      <div
        class="white--text font-weight-normal px-2"
        style="height:36px; line-height:36px; font-size:18px; margin-top: 6px;"
      >{{fileName}}</div>
      <v-spacer></v-spacer>
      <v-btn icon dark @click="downloadFile" flat>
        <v-icon>file_download</v-icon>
      </v-btn>
    </v-layout>
    <div class="content-layout">
      <v-img class="content" contain v-if="fileType.startsWith('image')" :src="fileURL"></v-img>

      <video
        class="content"
        :src="fileURL"
        v-else-if="fileType.startsWith('video')"
        @mouseover="t => t.target.play()"
        @mouseout="t => t.target.pause()"
        autoplay
        loop
      ></video>

      <div v-else class="warn-preview grey darken-3 white--text pa-4 elevation-4">
        <div style="text-align:center;">
          <div class="subheading font-weight-medium">미리보기를 할 수 없습니다.</div>
          <v-btn class="mt-3" dark color="blue" @click="downloadFile">
            <v-icon small class="pr-1" style="margin-top:3px;">file_download</v-icon>
            <b>파일 다운로드</b>
          </v-btn>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './dialog.preview.scss';
</style>

<script src="./dialog.preview.ts">
</script>


