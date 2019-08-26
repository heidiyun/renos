<template>
  <v-card class="c-layout round" height="100%" flat @dblclick="showPreview">
    <a-dropdown :trigger="['click']" v-if="!menu">
      <v-btn icon small class="more-icon" @click="isAuthorized">
        <v-icon small color="white">more_vert</v-icon>
      </v-btn>
      <a-menu slot="overlay">
        <a-menu-item key="0" @click="onDelete" :disabled="enableDelete ? false:true ">삭제</a-menu-item>
        <a-menu-item key="1" @click="showComment">댓글 달기</a-menu-item>
        <a-menu-item
          key="2"
          v-if="!file.data.pins[$store.getters.user.id]"
          @click=" addBookmark"
        >보관함에 추가</a-menu-item>
        <a-menu-item key="2" v-else @click="removeBookmark">보관함에서 삭제</a-menu-item>
        <a-menu-item
          key="3"
          @click="addMaterialDocument"
          v-if="!file.data.isMaterialDocument"
        >중요 문서함에 추가</a-menu-item>
        <a-menu-item
          key="3"
          v-else
          :disabled="file.data.ownerMaterialDocument === $store.getters.user.id ? false : true"
          @click="removeMaterialDocument"
        >중요 문서함에서 삭제</a-menu-item>
      </a-menu>
    </a-dropdown>

    <div class="card-image-container" style="padding:1px;">
      <v-img
      
        :src="file.data.fileURL"
        height="100%"
        class="card-image"
      
        v-if="fileIcon.tag === 'image'"
      ></v-img>
      <video
        :src="file.data.fileURL"
        loop
        v-else-if="fileIcon.tag === 'video'"
        style="width:100%;height:100%;"
        preload
        @mouseover="t => t.target.play()"
        @mouseout="t => t.target.pause()"
      ></video>

      <div style="height:100%; display:flex; justify-content:center; align-items:center;">
        <a-icon style="font-size : 60px; opacity : 0.8;" :type="fileIcon.icon"></a-icon>
      </div>
    </div>
    <v-card-title class="px-3 py-2 text-wrap card-title">
      <div style="width:100%; " class="card-text-layout">
        <div style="display:flex;" class="pb-1">
          <div class="mr-2">
            <span class="file-type" :style="{background : fileIcon.color}">{{fileIcon.tag}}</span>
          </div>
          <div class="file-name" style="font-weight:bold">{{file.data.name}}</div>
        </div>

        <div>
          <div style="font-size:13px; display:inline;" class="pl-1">
            {{fileOwner.data.name}}
            <a-tag
              class="add-tag"
              v-if="mainTag  ===''"
              @click.stop="addTag"
              @dbclick.stop
              style="float:right; background: #fff; borderStyle: dashed;"
            >
              <a-icon small type="plus" />Tag
            </a-tag>
            <div v-else @click.stop="menu = !menu" class="mr-2 px-1 main-tag">#{{mainTag}}</div>
          </div>
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


