<template>
  <div class="noti-view-layout mb-2" style="display:flex">
    <v-avatar tile size="30" class="mt-2">
      <img :src="activistUser.data.photoURL" style="border-radius:50%" alt="Avatar" />
    </v-avatar>
    <div class="noti-content-layout py-2 px-3 mb-2">
      <div class="noti-title subtitle-1 font-weight-bold">{{type}}</div>
      <div class="noti-message">{{notiMessage}}</div>
    </div>
    <div class="noti-actions ml-4" v-if="type === '초대알림'">
      <v-btn class="mt-2" icon small flat color="blue" @click.stop="acceptInvitation">수락</v-btn>
      <v-btn class="mt-2" icon small flat color="blue" @click.stop="checkNotification">거절</v-btn>
    </div>
    <div class="noti-actions ml-4" v-else>
      <v-btn class="mt-2" icon small flat color="blue" @click.stop="checkNotification">확인</v-btn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './notificationView.scss';
</style>

<script src="./notificationView.ts"></script>