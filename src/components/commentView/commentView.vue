<template>
  <div class="comment-input-container pa-2 mb-2">
    <div class="mb-3" style="display:flex;">
      <v-avatar tile size="35" class="mr-2">
        <img :src=" photoUrl" style="border-radius:50%" alt="Avatar" />
      </v-avatar>
      <div style="display:flex;">
        <div>
          <div class="caption font-weight-medium">{{userName}}</div>
          <div style="font-size:11px;" v-if=" !isEdited">{{date}}</div>
        </div>
        <div>
          <a-dropdown>
            <v-btn class="more-button" flat small icon>
              <v-icon small>more_vert</v-icon>
            </v-btn>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="onDelete" :disabled="enableDelete ? false: true">삭제</a-menu-item>
              <a-menu-item key="1" @click="showEditInput" :disabled="enableModify ? false: true">수정</a-menu-item>
            </a-menu>
          </a-dropdown>
        </div>
      </div>
    </div>
    <div class="pl-2 mb-3" v-if="!isEdited">{{comment.data.content}}</div>

    <a-textarea v-if="isEdited" v-model="commentModel" class="mb-3" placeholder="Add a comment"></a-textarea>
    <div style="display:flex; justify-content:flex-end;" v-if="isEdited">
      <a-button
        class="mr-2"
        size="small"
        type="primary"
        v-if="commentModel.length !== 0"
        @click="registerComment"
      >수정</a-button>

      <a-button size="small" @click="onCancel">취소</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './commentView.scss';
</style>

<script src="./commentView.ts">
</script>

