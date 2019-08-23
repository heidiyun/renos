<template>
  <v-app>
    <v-navigation-drawer
      app
      floating
      :temporary="$route.name === 'projects'"
      :permanent="$route.name !== 'projects'"
      width="230px;"
      style="overflow:hidden;"
      v-if="$route.name !== 'login'"
    >
      <v-flex class="side-menu" pt-3>
        <div class="logo-container">
          <span class="logo" @click="$router.push('/projects')">RABINET</span>
        </div>
        <v-btn large @click.stop="uploadFile" dark color="blue" v-if="currentRoleOfUser">
          <v-icon class="mr-2 ml-0" color="white">add</v-icon>파일 업로드
        </v-btn>

        <a-menu
          style="width: 230px"
          :openKeys="openKeys"
          @openChange="onOpenChange"
          :defaultOpenKeys="['sub1']"
          :defaultSelectedKeys="['1']"
          mode="inline"
        >
          <a-sub-menu key="sub1">
            <span slot="title">
              <a-icon type="folder" />
              <span>분류</span>
            </span>

            <a-menu-item key="1" @click="clickMenuItem( 'all')">전체</a-menu-item>
            <a-menu-item key="2" @click="clickMenuItem( 'file')">문서</a-menu-item>
            <a-menu-item key="3" @click="clickMenuItem( 'image')">이미지</a-menu-item>
            <a-menu-item key="4" @click="clickMenuItem( 'video')">동영상</a-menu-item>
          </a-sub-menu>
          <a-sub-menu key="sub2">
            <span slot="title">
              <a-icon type="user" />
              <span>멤버</span>
            </span>

            <a-menu-item
              v-for="(user,i) in currentProjectMembers"
              :key="i+4"
              @click="clickMenuItem('user',user.data.uid)"
            >{{user.data.name}}</a-menu-item>
          </a-sub-menu>
          <a-menu-item key="10" @click="clickMenuItem('material')">
            <a-icon type="star" />중요
          </a-menu-item>
          <a-menu-item key="11" @click="clickMenuItem('bookmark')">
            <a-icon type="inbox" />보관함
          </a-menu-item>
          <a-menu-item key="12" @click="clickMenuItem('activity-board')">
            <a-icon type="notification" />활동보드
          </a-menu-item>
        </a-menu>
      </v-flex>
    </v-navigation-drawer>
    <v-toolbar app color="white" flat height="90px;">
      <div class="title" v-if="$route.name === 'login' || $route.name === 'projects'">Rabinet</div>
      <v-select
        solo
        flat
        v-if="showSelect"
        :items="projectList"
        item-text="data.name"
        item-value="id"
        :label="currentProject"
        @change="onHandleChange"
        style="max-width :fit-content;"
      >
        <template v-slot:prepend-item>
          <v-list-tile>
            <v-list-tile-content>
              <v-list-tile-title
                class="select-all-tile"
                @click="$router.push('/projects')"
              >모든 프로젝트 보기</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider class="mt-2"></v-divider>
        </template>
      </v-select>

      <v-spacer></v-spacer>

      <v-btn
        @click.stop="createProject"
        dark
        color="blue"
        round
        v-if="$route.name==='projects'"
        class="mr-5"
      >
        <v-icon class="mr-2 ml-0" color="white">add</v-icon>프로젝트 생성
      </v-btn>

      <v-btn
        icon
        @click="$dialogMemberManagement.open($store.getters.user.id, $store.getters.currentProject.id)"
      >
        <a-icon style="font-size:16px" type="setting" />
      </v-btn>

      <opener ref="notiOpener" @state="state => showNotifications = state">
        <v-btn icon @click.stop="$refs.notiOpener.open">
          <v-badge left overlap>
            <template v-slot:badge>{{notifications.length}}</template>
            <v-icon>notifications</v-icon>
          </v-badge>
        </v-btn>

        <v-card
          class="notification-card round py-2 px-3"
          v-if="showNotifications"
          @close="showNotifications  = false"
        >
          <div v-if="notifications.length===0" class="no-new-notification-sign pt-2">새로운 알림이 없습니다.</div>
          <div v-for="noti in notifications" :key="noti.id">
            <notification-view :noti="noti"></notification-view>
          </div>
        </v-card>
      </opener>

      <opener ref="profileOpener" @state="state => profileButtonClicked = state">
        <v-btn
          flat
          icon
          class="profile"
          :ripple="false"
          target="_blank"
          v-if="$store.getters.user !== undefined"
          :style="{backgroundImage : $store.getters.user ? `url(${$store.getters.user.data.photoURL})` : ''}"
          @click.stop="$refs.profileOpener.open"
        ></v-btn>
        <profile-card v-if="profileButtonClicked" @close="profileButtonClicked  = false"></profile-card>
      </opener>
    </v-toolbar>
    <v-snackbar v-model="snackbar" bottom left :timeout="Number(6000)">
      {{snackbarText}}
      <v-btn color="gray" icon small flat @click="snackbar = false">
        <v-icon small>clear</v-icon>
      </v-btn>
    </v-snackbar>
    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<style lang="scss" >
@import './app.scss';
</style>


<script src="./app.ts">
</script>
