import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from '../../catalog';


const dataDir = path.join(process.cwd(), '_data');
const catalog = new Catalog(dataDir);

const INITIAL_STATE = {
  loading: false,
  dats: [],
  error: null,
};

Vue.use(Vuex);

const store = new Vuex.Store({
  state: INITIAL_STATE,
  mutations: {
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setDats: (state, payload) => {
      state.dats = payload;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
  },
  actions: {
    loadCatalog: ({ commit }) => {
      commit('setLoading', true);
      catalog.initDatabase()
        .then(() => catalog.cleanupDatsRegistry())
        .then(() => catalog.discoverDats())
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getDats: ({ commit }) => {
      commit('setLoading', true);
      // async action to get dats
      catalog.getDats()
        .then(dats => commit('setDats', dats))
        .finally(() => commit('setLoading', false));
    },
    loadDirectoryAsDat: ({ commit }) => {
      // need to figure out setting simple name too
      // or just derive from the directory and let user rename later.
      commit('setLoading', true);
      remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (file) => {
        // use promise here to check if dir is dat, and then import or make
        console.log(file);
        catalog.importDir(file[0]);
        commit('setLoading', false);
      });
    },
  },
});

export default store;
