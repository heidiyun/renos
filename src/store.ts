import Vue from 'vue';
import Vuex from 'vuex';
import { FirestoreDocument } from './vue-common';
import User from './models/user';
import Project from './models/project';

Vue.use(Vuex);

export interface State {
  user: FirestoreDocument<User> | undefined;
  projectList: Array<FirestoreDocument<Project>> | undefined;
  categoryGroups: Array<FirestoreDocument<Project>> | undefined;
}

export default new Vuex.Store<State>({
  state: {
    user: undefined,
    projectList: undefined,
    categoryGroups: undefined
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    },
    setProjectList(state, payload) {
      state.projectList = payload;
    },
    setCategoryGroups(state, payload) {
      state.categoryGroups = payload;
    }
  },
  getters: {
    user(state) {
      return state.user;
    },
    projectList(state) {
      return state.projectList;
    },
    categoryGroups(state) {
      return state.categoryGroups;
    }
  }
});
