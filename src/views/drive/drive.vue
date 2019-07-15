<template>
  <v-container fluid
               ma-0
               pa-0
               style="overflow-y:auto; height:100vh;">
    <v-layout>
      <v-flex>
        <div class="content-container">
          <div class="category"
               style="padding: 0px 36px;">
            <div class="content-title">빠른 액세스</div>
          </div>
          <div class="content">
            <v-layout class="file-card-layout"
                      wrap
                      style="width:100%"
                      pa-2>
              <v-flex style="width=325px; height : 250px;"
                      xl2
                      lg3
                      md4
                      sm6
                      xs12
                      v-for=" (file,i) in fileList"
                      :key="i"
                      px-2
                      py-3>
                <file-card :file="file"></file-card>
              </v-flex>
            </v-layout>
          </div>

        </div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './drive.scss';
</style>

<script src="./drive.ts">
</script>

