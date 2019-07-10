<template>
  <v-dialog v-model="showProgressbar" width="400px" style="height:100px;">
    <div class="progress-container">
      <v-progress-circular color="blue" indeterminate></v-progress-circular>
    </div>
  </v-dialog>
</template>

<script src="./progress.ts"></script>

<style lang="scss" scoped>
@import './progress.scss';
</style>

