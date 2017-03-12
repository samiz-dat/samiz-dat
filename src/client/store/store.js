import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import config from '../../config';
import { createCatalog } from '../../catalog';

const dataDir = path.join(process.cwd(), config.get('dataDir'));
const catalog = createCatalog();

const INITIAL_STATE = {
  loading: false,
  dats: [],
  error: null,
};

Vue.use(Vuex);

const store = new Vuex.Store({
  state: INITIAL_STATE,
  mutations: {
    setDats: (state, payload) => {
      state.dats = payload;
    },
  },
  actions: {
    getDats: ({ commit }) => {
      commit('setLoading', true);
      // async action to get dats
    },
  },
});

export default store;
