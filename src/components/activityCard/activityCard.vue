<template>
  <v-card class="box-shadow" style="width:100%; height: 100%;">
    <v-card-title>{{date}}</v-card-title>
    <v-divider></v-divider>
    <div style="display:flex; height: calc(100% - 57px); justify-content:space-between;">
      <div class="px-3">
        <div style="display:flex" class="mt-3">
          <v-avatar tile size="40">
            <img :src="user.data.photoURL" style="border-radius:50%" alt="Avatar" />
          </v-avatar>
          <div class="pt-2 mx-3">
            <span style="font-weight:bold; height:fit-content">{{user.data.name}}</span>
            <span style="height:fit-content">{{explanation}}</span>
          </div>
        </div>
        <div style="margin-left:56px;" class="mt-3">
          <span class="file-type" :style="{background : fileIcon.color}">{{fileIcon.tag}}</span>
          <span class="ml-2">{{file.data.name}}</span>
        </div>
      </div>

      <div style="height:100%;">
        <!-- <div
          v-if="this.type === 'writeComment' || this.type === 'modifyComment'"
        >{{activity.data.comment}}</div>-->
        <img
          style="height:100%"
          v-if="fileIcon.tag === 'image' && (this.type === 'upload')"
          :src="file.data.fileURL"
        />

        <div
          style="height:100%; display:flex; justify-content:center; align-items:center;"
          v-if="fileIcon.kind === 'file'"
        >
          <a-icon style="font-size : 60px; opacity : 0.8;" :type="fileIcon.icon"></a-icon>
        </div>
      </div>
    </div>
  </v-card>
</template>

<style lang="scss" scoped>
@import './activityCard.scss';
</style>


<script src='./activityCard.ts'></script>
