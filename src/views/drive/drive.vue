<template>
  <v-container style="padding:0px" fill-height fluid>
    <v-layout>
      <div class="category">
        <v-btn round large>
          <v-icon style="margin-right : 12px">add</v-icon>새 프로젝트
        </v-btn>
        <v-list>
          <v-list-group
            v-for=" i in category"
            :key="i"
            v-model="i.active"
            :prepend-icon="i.action"
            no-action
          >
            <template v-slot:activator>
              <v-list-tile>
                <v-list-tile-content>
                  <v-list-tile-title>{{ i.item }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </template>

            <v-list-tile>
              <v-list-tile-content>
                <v-list-tile-title></v-list-tile-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon></v-icon>
              </v-list-tile-action>
            </v-list-tile>
          </v-list-group>
        </v-list>
      </div>

      <v-flex md3 sm6 xs12>
        <v-btn>Button</v-btn>
        <v-btn>Button</v-btn>
        <v-btn>Button</v-btn>
        <v-card color="#ccc" height="250px"></v-card>
        <v-card color="#ccc" height="250px"></v-card>
        <v-card color="#ccc" height="250px"></v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<style lang="scss" scoped>
@import './drive.scss';
</style>

<script src="./drive.ts">
</script>


