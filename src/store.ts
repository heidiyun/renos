import Vue from 'vue';
import Vuex from 'vuex';
import { FirestoreDocument } from './vue-common';
import User from './models/user';
import Project from './models/project';
import ProjectFile from './models/projectFile';

Vue.use(Vuex);

export interface State {
  user: FirestoreDocument<User> | undefined;
  projectList: Array<FirestoreDocument<Project>> | undefined;
  categoryGroups: Array<FirestoreDocument<Project>> | undefined;
  currentProject: FirestoreDocument<Project> | undefined;
  selectedFile: FirestoreDocument<ProjectFile> | undefined;
  selectedFileType: string | undefined;
}

export default new Vuex.Store<State>({
  state: {
    user: undefined,
    projectList: undefined,
    categoryGroups: undefined,
    currentProject: undefined,
    selectedFile: undefined,
    selectedFileType: undefined
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
    },
    setCurrentProject(state, payload) {
      state.currentProject = payload;
    },
    setSelectedFile(state, payload) {
      state.selectedFile = payload;
    },
    setSelectedFileType(state, payload) {
      state.selectedFileType = payload;
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
    },
    currentProject(state) {
      return state.currentProject;
    },
    selectedFile(state) {
      return state.selectedFile;
    },
    selectedFileType(state) {
      return state.selectedFileType;
    }
  }
});
