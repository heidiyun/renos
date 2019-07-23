<template>
  <v-card class="c-layout round" height="100%" flat @dblclick="showPreview">
    <a-dropdown :trigger="['click']" v-if="!menu">
      <v-btn icon small class="more-icon" @click="isAuthorized">
        <v-icon small color="white">more_vert</v-icon>
      </v-btn>
      <a-menu slot="overlay">
        <a-menu-item key="0" @click="onDelete" v-if="enableDelete">삭제</a-menu-item>
        <a-menu-item key="0" disabled @click="onDelete" v-else>삭제</a-menu-item>
        <a-menu-item key="1" @click="showComment">댓글 달기</a-menu-item>
      </a-menu>
    </a-dropdown>

    <div class="card-image-container">
      <div class="tag-window pa-2" v-if="menu" @dblclick.stop>
        <div style="display:flex; width:100%;">
          <div class="title font-weight-bold px-1 pt-1">TAGS</div>
          <v-spacer></v-spacer>
          <v-btn small icon class="ma-0" @click="menu = !menu; inputValue = ''">
            <v-icon small style="align-content:space-between;">clear</v-icon>
          </v-btn>
        </div>

        <a-input
          class="mt-3"
          v-model="inputValue"
          @keypress.enter="createTag"
          @focus="visibleList = true"
          @focusout="visibleList = false"
        ></a-input>

        <v-card class="tag-list-container box-shadow" v-if="visibleList">
          <a-list size="small" :dataSource="exampleTags">
            <a-list-item
              class="list-item pl-4"
              slot="renderItem"
              slot-scope="item, index"
              @click.stop="createTag"
            >
              <a-tooltip v-if="item.length > 20" :key="item" :title="item">
                <a-tag :key="item" :closable="true" color="pink">{{`${tag.slice(0, 20)}...`}}</a-tag>
              </a-tooltip>
              <a-tag :closable="false" color="pink">{{item}}</a-tag>
            </a-list-item>
          </a-list>
        </v-card>

        <div class="mt-3" style="overflow:auto; height:calc(100% - 90px);">
          <div style="display:inline" v-for="tag in attachedTags" :key="tag" @click="mainTag = tag">
            <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
              <a-tag
                :key="tag"
                :afterClose="() => deleteTag(tag)"
                :closable="true"
              >{{`${tag.slice(0, 20)}...`}}</a-tag>
            </a-tooltip>
            <a-tag v-else class="mb-2" :afterClose="() => deleteTag(tag)" :closable="true">{{tag}}</a-tag>
          </div>
        </div>
      </div>
      <v-img
        :src="file.data.fileURL"
        height="100%"
        class="card-image;"
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
          <div style="font-size:13px;" class="pl-1">
            Yunjeong Goo
            <a-tag class="mb-2" >design</a-tag>
            <!-- <a-tag
              @click.stop="menu = !menu"
              @dblclick.stop
              style="float:right; background: #fff; borderStyle: dashed;"
            >
              <a-icon small type="plus" />Tag
            </a-tag>-->

            <!-- <div v-if="menu" class="tag-layout">
              <a-input
                class="tag-input"
                @focus="visibleList = true"
                @focusout="visibleList=false"
                v-model="inputValue"
                @keypress.enter="createTag"
              ></a-input>
              <div style=" height: 280px;overflow:auto">
                <a-list
                  id="tag-list"
                  v-if="visibleList"
                  loadMore
                  size="small"
                  bordered
                  :dataSource="tags"
                >
                  <a-list-item slot="renderItem" slot-scope="item, index">{{item}}</a-list-item>
                </a-list>
              </div>
              <div style="width : 100%; height : 200px;"></div>
            </div>-->
          </div>
        </div>
      </div>
    </v-card-title>
    <!-- <div>
      <template v-for="(tag, index) in tags">
        <a-tooltip v-if="tag.length > 20" :key="tag" :title="tag">
          <a-tag
            :key="tag"
            :closable="true"
            :afterClose="() => handleClose(tag)"
            color="pink"
          >{{`${tag.slice(0, 20)}...`}}</a-tag>
        </a-tooltip>
        <a-tag
          v-else
          :key="tag"
          :closable="true"
          color="pink"
          :afterClose="() => handleClose(tag)"
        >{{tag}}</a-tag>
      </template>
      <a-input
        v-if="inputVisible"
        ref="input"
        type="text"
        size="small"
        :style="{ width: '78px' }"
        :value="inputValue"
        @change="handleInputChange"
        @blur="handleInputConfirm"
        @keyup.enter="handleInputConfirm"
      />
      <a-tag v-else @click="showInput" style="background: #fff; borderStyle: dashed;">
        <a-icon type="plus" />New Tag
      </a-tag>
    </div>-->
  </v-card>
</template>

<style lang="scss" scoped>
@import './fileCard.scss';
</style>

<script src="./fileCard.ts">
</script>


