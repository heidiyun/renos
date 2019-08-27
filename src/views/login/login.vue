<template>
  <v-container fill-height fluid class="container pa-0">
    <v-layout style="width:100%;" justify-center fill-height align-center>
      <div class="title-layout ml-5 pl-5">
        <div class="display-2" style="width:100%;">당신의 리소스를 Rabinet에 보관해보세요</div>
        <div class="width:100%;" style="display:flex;">
          <v-btn
            color="blue"
            style="margin:auto; "
            class="mt-4 title"
            dark
            flat
            large
            @click="login()"
            v-if="!disableButton"
          >시작하기</v-btn>
        </div>
      </div>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './login.scss';
</style>

<script src='./login.ts'>
</script>



