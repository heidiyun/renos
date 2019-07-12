<template>
  <v-dialog max-width="395px"
            height="180px"
            v-model="on">
    <v-card class="pa-2">
      <v-card-title style="font-size:18px; font-weight:bold">{{title}}</v-card-title>
      <v-card-text>{{content}}</v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="blue darken-1"
               small
               flat
               @click="onClickNegative">{{negative}}</v-btn>

        <v-btn color="blue darken-1"
               small
               @click="onClickPositive"
               dark>{{positive}}</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './dialog.simple.scss';
</style>


<script src='./dialog.simple.ts'>
</script>

