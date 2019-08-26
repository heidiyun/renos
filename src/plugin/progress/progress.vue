<template>
  <v-dialog v-model="showProgress" persistent width="400px">
    <div class="progress-container">
      <v-progress-circular color="green" indeterminate></v-progress-circular>
    </div>
  </v-dialog>
</template>

<style lang="scss" scoped>
@import './progress.scss';
</style>


<script src='./progress.ts'>
</script>

