<template>
  <v-container fluid ma-0 pa-0 style>
    <v-layout>
      <v-flex>
        <div
          id="drop-zone"
          v-bind:class="isDragging?'drag-over':''"
          v-on:dragover="isDragging=true"
          v-on:dragenter="isDragging=true"
          v-on:dragleave="isDragging=false"
        >
          <div class="text-wrap">
            <span></span>
          </div>
          <input
            type="file"
            @click.stop.prevent
            @change="e => {isDragging = false;  $app.util.saveFile(e, $store.getters.currentProject.id, $store.getters.user.id); }"
            v-if="currentRoleOfUser"
            multiple
          />
        </div>
        <div class="content-container">
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
                    >{{alignmentKey.name}}</v-btn>
                  </template>
                  <a-list
                    size="small"
                    bordered
                    :dataSource="alignmentKeys.keys"
                    style="z-index:10; background:white; cursor:pointer"
                  >
                    <a-list-item
                      slot="renderItem"
                      slot-scope="item"
                      v-if="item.key === 'shareDate' ? $store.getters.selectedMenu === 'material' ? true: false : true"
                      @click="alignmentKey= item"
                    >{{item.name}}</a-list-item>
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
            <div
              style="width:100%;"
              class="px-3"
              v-if="$store.getters.selectedMenu === 'activity-board'"
            >
              <div v-for=" (activity,i) in currentActivities" :key="i" class="mb-4">
                <activity-card style="width:750px; height:fit-content" :activity="activity"></activity-card>
              </div>
            </div>
            <v-layout
              wrap
              class="card-container"
              style="width:100%;"
              pa-2
              mb-5
              v-else-if="project.data.displayWay === 'card'"
            >
              <v-flex
                style="height: 300px;"
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
                  @remove-tag="removeTag"
                  @open-comment="openComment"
                ></file-card>
              </v-flex>
            </v-layout>

            <v-layout v-else style="width:100%;">
              <file-table :fileList="latestAccessdFileList"></file-table>
            </v-layout>
          </div>
        </div>
      </v-flex>
      <div class="comment-menu" v-if="showComment">
        <div style="display:flex;">
          <div
            class="pa-3 subheading font-weight-medium comment-title"
          >{{ commentTabKey === 'project-comment-tab' ? project.data.name : $store.getters.selectedFile.data.name }}</div>
          <v-btn icon flat @click="showComment=false;">
            <v-icon>clear</v-icon>
          </v-btn>
        </div>

        <a-tabs
          defaultActiveKey="file-comment-tab"
          @change="commentTabKey === 'project-comment-tab' ? commentTabKey='file-comment-tab' : commentTabKey='project-comment-tab'"
        >
          <a-tab-pane tab="프로젝트 댓글" key="project-comment-tab">
            <div class="project-commnet-window">
              <div
                class="px-2 py-1"
                style="width:100%;"
                v-for="(comment,i) in currentProjectCommentList"
                :key="`key1- ${i}`"
              >
                <comment-view :comment="comment" :role="role" :commentType="commentTabKey"></comment-view>
              </div>
              <div class="px-2 py-1">
                <comment-write-view :commentType="commentTabKey"></comment-write-view>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane tab="파일 댓글" key="file-comment-tab">
            <div class="file-comment-window">
              <div class="px-2 py-1" v-for="(comment,i) in currentCommentList" :key="`key2- ${i}`">
                <comment-view :comment="comment" :role="role" :commentType="commentTabKey"></comment-view>
              </div>
              <div class="px-2 py-1">
                <comment-write-view :commentType="commentTabKey"></comment-write-view>
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

