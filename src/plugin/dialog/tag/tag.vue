<template>
  <v-dialog v-model="show" max-width="395px" height="300px">
    <v-card class="px-3 py-3" style="height: 300px;">
      <div style="display:flex; width:100%;">
        <div class="title font-weight-bold px-1">TAG</div>
        <v-spacer></v-spacer>
        <v-btn small icon class="ma-0" @click="show=false; inputValue = ''">
          <v-icon small style="align-content:space-between;">clear</v-icon>
        </v-btn>
      </div>

      <div>
        <a-input-search
          class="mt-3"
          style="width: 350px"
          v-model="inputValue"
          @keypress.enter="createTag(inputValue)"
          @click.stop="$refs.opener.open"
        ></a-input-search>
        <opener ref="opener" @state="state => visibleList = state">
          <v-card class="tag-list-container box-shadow" style="width: 350px" v-if="visibleList">
            <a-list size="small" :dataSource="exampleTags">
              <a-list-item
                class="list-item pl-4"
                @click.stop="createTag(item.name, item.color === undefined ? undefined : item.color)"
                slot="renderItem"
                slot-scope="item, index"
              >
                <a-tooltip v-if="item.length > 20" :key="item" :title="item.name">
                  <a-tag
                    :key="item"
                    :closable="true"
                    :color="item.color"
                  >{{`${item.name.slice(0, 20)}...`}}</a-tag>
                </a-tooltip>
                <a-tag :closable="false" :color="item.color">{{item.name}}</a-tag>
                <v-spacer></v-spacer>
                <div @click.stop="is=!is" class="mr-2 pl-2 list-detail-menu-container">
                  <v-menu offset-x>
                    <template v-slot:activator="{ on }">
                      <v-btn icon v-on="on" small class="ma-0">
                        <a-icon class="list-detail-menu" type="ellipsis" />
                      </v-btn>
                    </template>
                    <a-list
                      size="small"
                      bordered
                      style="z-index:10; background:white; cursor:pointer"
                      @click
                    >
                      <a-list-item @click="removeProjectTag(item)">삭제</a-list-item>
                    </a-list>
                  </v-menu>
                </div>
              </a-list-item>
            </a-list>
          </v-card>
        </opener>

        <div class="mt-3" style="overflow:auto; height:calc(100% - 90px);">
          <div
            style="display:inline"
            v-for="tag in file.data.tags"
            :key="tag.name"
            @click="pickMainTag(tag)"
          >
            <a-tooltip v-if="tag.name.length > 20" :key="tag.name" :title="tag">
              <a-tag
                :key="tag"
                :afterClose="() => deleteTag(tag)"
                :closable="true"
                :color="tag.color"
              >{{`${tag.name.slice(0, 20)}...`}}</a-tag>
            </a-tooltip>
            <a-tag :color="tag.color" class="mb-2">
              {{tag.name}}
              <a-icon @click.stop="deleteTag(tag.name)" type="close" />
            </a-tag>
          </div>
        </div>
      </div>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './tag.scss';
</style>

<script src="./tag.ts"></script>