<template>
  <v-container fill-height>
    <v-layout style="width:100%;" class="pl-5" justify-center fill-height align-center>
      <div style="width:300px;" class>
        <v-img
          height="300px"
          contain
          src="https://user-images.githubusercontent.com/38517815/63260096-0cbe9400-c2bb-11e9-8c05-5565e21df334.png"
        ></v-img>
      </div>
      <div class="ml-5 pl-5">
        <div class="display-1" style="width:100%;">당신의 리소스를 Rabinet에 보관해보세요</div>

        <div class="width:100%;" style="display:flex;">
          <v-btn
            color="green"
            style="margin:auto; "
            class="mt-4"
            dark
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



