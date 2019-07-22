<template>
  <v-dialog max-width="395px" height="180px" v-model="on">
    <v-card class="pa-2">
      <v-card-title style="font-size:18px; font-weight:bold">{{title}}</v-card-title>
      <a-select mode="tags" style="width: 100%" placeholder="Tags Mode">
        <a-select-option
          v-for="i in 25"
          :key="(i + 9).toString(36) + i"
        >{{(i + 9).toString(36) + i}}</a-select-option>
      </a-select>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1" small flat @click="onClickNegative">{{negative}}</v-btn>

        <v-btn color="blue darken-1" small dark @click="onClickPositive">{{positive}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './dialog.input.scss';
</style>


<script src='./dialog.input.ts'>
</script>

