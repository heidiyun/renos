<template>
  <v-container fluid
               ma-0
               pa-0>
    <v-layout>
      <v-flex>
        <div class="content-layout">
          <div class="content-top-menu">
            <div class="project-title">{{project.data.name}}</div>
          </div>
          <div class="content">
            <v-layout class="content-layout"
                      wrap
                      style="width:100%"
                      pa-2>
              <v-flex style="width=325px; height : 250px;"
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

