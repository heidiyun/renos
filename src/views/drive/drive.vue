<template>
  <v-container fluid ma-0 pa-0 style="height:100vh;">
    <v-layout>
      <v-flex>
        <div
          id="drop-zone"
          v-bind:class="[isDragging?'drag-over':'']"
          v-on:dragover="isDragging=true"
          v-on:dragenter="isDragging=true"
          v-on:dragleave="isDragging=false"
        >
          <div class="text-wrap">
            <span></span>
          </div>
          <input type="file" @change="onChange" multiple />
        </div>
        <div
          class="content-container"
          :style="showComment? {width:'calc(100vw - 500px)'} : {width : '100%'}"
        >
          <div class="category px-4 py-2" style="display:flex">
            <div class="content-title">빠른 액세스</div>

            <a-select
              class="ml-5 pt-1"
              @change="onHandleSelectedTagChanged"
              mode="multiple"
              placeholder="Please select"
            >
              <a-select-option v-for="tag in project.data.tags" :key="tag.name">{{tag.name}}</a-select-option>
            </a-select>
          </div>
          <div class="content px-4">
            <v-layout wrap class="card-container" style="width:100%" pa-2>
              <v-flex
                style="width=325px; height : 300px;"
                xl2
                lg3
                md4
                sm6
                xs12
                v-for=" (file,i) in latestAccessdFileList"
                :key="i"
                px-2
                py-3
              >
                <file-card
                  :file="file"
                  :tags="currentTag"
                  :isOwner="isOwner"
                  @added-tag="addTag"
                  @open-comment="openComment"
                ></file-card>
              </v-flex>
            </v-layout>
          </div>
        </div>
      </v-flex>
      <div class="comment-menu" :style="showComment? {display:'inline'} : {display:'none'}">
        <div style="display:flex;">
          <div
            class="pa-3 subheading font-weight-medium comment-title"
          >{{ showComment === true ? (keyNum == 1 ? project.data.name : $store.getters.selectedFile.data.name) : ''}}</div>
          <v-btn icon flat @click="showComment=false;">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>
        <a-tabs defaultActiveKey="2" @change="keyNum === 1 ? keyNum=2 : keyNum = 1">
          <a-tab-pane tab="프로젝트 댓글" key="1">
            <div
              style="width:87%; height:calc(100vh - 200px); overflow-y:scroll; justify-content:center; "
            >
              <div
                class="px-2 py-1"
                v-for="(comment,i) in currentProjectCommentList"
                :key="`key1- ${i}`"
              >
                <comment-view :comment="comment" :isInput="false" :keyNum="1"></comment-view>
              </div>
              <div class="px-2 py-1">
                <comment-view :comment="null" :isInput="true" :keyNum="1"></comment-view>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="파일 댓글" key="2">
            <div
              style="width: 87%;height:calc(100vh - 200px); overflow-y:scroll; justify-content:center; "
            >
              <div class="px-2 py-1" v-for="(comment,i) in currentCommentList" :key="`key2- ${i}`">
                <comment-view :comment="comment" :isInput="false" :keyNum="2"></comment-view>
              </div>
              <div class="px-2 py-1">
                <comment-view :comment="null" :isInput="true" :keyNum="2"></comment-view>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './drive.scss';
</style>

<script src="./drive.ts">
</script>

