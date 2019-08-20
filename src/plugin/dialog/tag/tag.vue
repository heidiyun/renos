<template>
  <v-dialog v-model="show" max-width="500px">
    <v-card class="px-3 py-3" style="height: 100%;">
      <div style="display:flex; width:100%;">
        <div class="title font-weight-bold px-1">TAG -</div>
        <div class="subtitle-2">{{file.data.name}}</div>
      </div>

      <div style="display:flex; width:100%;">
        <div class="pr-2" style="width:50%;">
          <a-input-search class="mt-3" v-model="inputValue" @keypress.enter="createTag(inputValue)"></a-input-search>
          <div style="height : 300px; overflow:auto;">
            <a-list size="small" :dataSource="tags">
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
          </div>
        </div>

        <div class="mt-3" style="overflow:auto; width:50%; height:300px;">
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
      <!-- <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat>I accept</v-btn>
      </v-card-actions>-->
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './tag.scss';
</style>

<script src="./tag.ts"></script>