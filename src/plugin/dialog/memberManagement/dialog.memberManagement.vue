<template>
  <v-dialog v-model="on" height="460px" width="580px">
    <v-card class="card-layout">
      <v-toolbar color="blue" flat dark height="80px">
        <v-toolbar-title>멤버 추가</v-toolbar-title>
      </v-toolbar>
      <div class="member-invite-input-layout py-4">
        <v-text-field
          class="mx-4"
          v-model="emailInputValue"
          @blur="checkValidEmail"
          :error-messages="invalidEmail ? '없는 사용자 이메일 입니다.' : ''"
          placeholder="이메일 주소 추가"
          :persistent-hint="true"
        ></v-text-field>
        <v-select
          :items="userTypes"
          v-model="defaultValue"
          style="width: 100px; margin-left:14px;"
          solo
          flat
        ></v-select>
        <v-text-field
          class="mx-4"
          v-model="inviteMessage"
          placeholder="초대 메시지"
          :persistent-hint="true"
        ></v-text-field>
      </div>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat color="red" @click="off">취소</v-btn>
        <v-btn flat @click="sendInvitation">보내기</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './dialog.memberManagement.scss';
</style>

<script src="./dialog.memberManagement.ts"></script>