import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from 'dat-cardcat';


const dataDir = path.join(process.cwd(), '_data');
const catalog = new Catalog(dataDir);

const INITIAL_STATE = {
  loading: false,
  dats: [],
  selectedDats: [],
  files: {},
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
    selectDats: (state, payload) => {
      state.selectedDats = payload;
    },
    setDatFiles: (state, payload) => {
      Vue.set(state.files, payload.key, payload.files);
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  getters: {
    getDatFiles: state => key => state.files[key],
  },
  // later we should refactor this into a seporate file
  actions: {
    loadCatalog: ({ commit }) => {
      commit('setLoading', true);
      return catalog.initDatabase()
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
    getFiles: ({ commit }, payload) => {
      commit('setLoading', true);
      catalog.getItemsWith({}, payload)
        .then(files => commit('setDatFiles', { key: payload, files }))
        .finally(() => commit('setLoading', false));
    },
    download: ({ commit }, item) => {
      commit('setLoading', true);
      catalog.checkout(item)
        .finally(() => commit('setLoading', false));
    },
    loadDirectoryAsDat: ({ commit }) => {
      // need to figure out setting simple name too
      // or just derive from the directory and let user rename later.
      commit('setLoading', true);
      remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (file) => {
        if (Array.isArray(file)) {
          catalog.importDir(file[0])
          .catch(e => commit('setError', e))
          .finally(() => commit('setLoading', false));
        } else {
          commit('setLoading', false);
        }
      });
    },
    importDat: ({ commit }, payload) => {
      commit('setLoading', true);
      catalog.importRemoteDat(payload.key, payload.name)
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
  },
});

export default store;
