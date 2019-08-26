<template>
  <div class="comment-input-container pa-2">
    <div class="user-info">
      <v-avatar tile size="32" class="mr-2">
        <img :src="$store.getters.user.data.photoURL" style="border-radius: 50%" />
      </v-avatar>
      <div>{{$store.getters.user.data.name}}</div>
    </div>
    <a-textarea class="my-3" v-model="ui.inputValue" placeholder="내용을 입력하세요."></a-textarea>
    <div class="button-layout">
      <a-button
        size="small"
        type="primary"
        class="mr-1"
        :disabled="ui.inputValue.length === 0"
        @click="registerComment"
      >등록</a-button>
      <a-button size="small" @click="cleanInputValue">취소</a-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './commentWriteView.scss';
</style>

<script src="./commentWriteView.ts"></script>