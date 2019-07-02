import Vue from 'vue';
import Vuex from 'vuex';
import { FirestoreDocument } from './vue-common';
import User from './models/user';

Vue.use(Vuex);

export interface State {
  user: FirestoreDocument<User> | undefined;
}

export default new Vuex.Store<State>({
  state: {
    user: undefined
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload;
    }
  },
  getters: {
    user(state) {
      return state.user;
    }
  }
});
