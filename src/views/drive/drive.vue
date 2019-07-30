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
          <input type="file" @click.stop.prevent @change="onChange" multiple />
        </div>
        <div
          class="content-container"
          :style="showComment? {width:'calc(100vw - 500px)'} : {width : '100%'}"
        >
          <div class="category px-3 pt-2" style="display:flex">
            <div class="content-title"></div>
            <a-input-group compact class="mt-3 ml-4" style="width:fit-content;">
              <a-select labelInValue :defaultValue="{ key: 'tag' }" style="width: 120px">
                <a-select-option value="tag">태그</a-select-option>
                <a-select-option value="user">사용자</a-select-option>
              </a-select>
              <a-select
                @change="onHandleSelectedTagChanged"
                mode="multiple"
                placeholder="tag select"
                color="blue"
                style="min-width:200px; max-width:fit-content;"
              >
                <a-select-option
                  style="background:green;"
                  v-for="tag in project.data.tags"
                  :key="tag.name"
                >
                  <a-tag :color="tag.color">{{tag.name}}</a-tag>
                </a-select-option>
              </a-select>
            </a-input-group>

            <!-- <v-btn
              v-if="role==='supervisor'"
              flat
              class="mx-3"
              style="margin-top:12px;"
              @click="on = !on"
            >
              <a-icon type="user-add" />멤버관리
            </v-btn>-->

            <v-spacer></v-spacer>

            <div style="display:flex; margin-top:12px" class="text-center mx-3">
              <v-btn icon class="ma-0" @click="changeFileDisplayWay">
                <a-icon :type="project.data.displayWay === 'table' ? 'appstore' : 'table' " />
              </v-btn>
              <div style="display:flex; ">
                <v-menu bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      class="ma-0"
                      style="width:fit-content;"
                      flat
                      v-on="on"
                    >{{alignmentKey === 'name' ? '이름' : '업로드 시간'}}</v-btn>
                  </template>
                  <a-list
                    size="small"
                    bordered
                    :dataSource="alignmentKeys.name"
                    style="z-index:10; background:white; cursor:pointer"
                  >
                    <a-list-item
                      slot="renderItem"
                      slot-scope="item, index"
                      @click="alignmentKey= item === '이름' ? 'name' : 'uploadDate'"
                    >{{item}}</a-list-item>
                  </a-list>
                </v-menu>

                <v-btn icon @click="changeAlignmentOrder" class="ma-0">
                  <v-icon small v-if="alignmentKeys.order === 'dsc'">arrow_downward</v-icon>
                  <v-icon small v-else>arrow_upward</v-icon>
                </v-btn>
              </div>
            </div>
          </div>
          <div class="content px-4">
            <v-layout
              wrap
              class="card-container"
              style="width:100%;"
              pa-2
              mb-5
              v-if="project.data.displayWay === 'table'"
            >
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
                  :role="role"
                  @added-tag="addTag"
                  @remove-tag="removeTag"
                  @open-comment="openComment"
                ></file-card>
              </v-flex>
            </v-layout>
            <v-layout v-else style="width:100%; height:100vh; ">
              <file-table :fileList="latestAccessdFileList"></file-table>
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

