<template>
  <a-table
    class="mt-4"
    :columns="columns"
    style="width:100%; height:100%;"
    :dataSource="currentFileList"
    size="default"
  ></a-table>
</template>

<style lang="scss" scoped>
@import './fileTable.scss';
</style>

<script src='./fileTable.ts'></script>

