import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from 'dat-cardcat';


const dataDir = path.join(process.cwd(), '_data');
const catalog = new Catalog(dataDir);

const INITIAL_STATE = {
  loading: false,
  authorLetters: [],
  dats: [],
  selectedDats: [],
  files: {},
  error: null,
};

Vue.use(Vuex);

const setIdentity = key => (state, payload) => { state[key] = payload; };

const store = new Vuex.Store({
  state: INITIAL_STATE,
  mutations: {
    setLoading: setIdentity('loading'),
    setAuthorLetters: setIdentity('authorLetters'),
    setDats: setIdentity('dats'),
    selectDats: setIdentity('selectedDats'),
    setDatFiles: (state, payload) => {
      Vue.set(state.files, payload.key, payload.files);
    },
    setError: setIdentity('error'),
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
    getAuthorLetters: ({ commit }) => {
      commit('setLoading', true);
      return catalog.getAuthorLetters()
        .then(letters => commit('setAuthorLetters', letters.map(v => v.letter)))
        .finally(() => commit('setLoading', false));
    },
    getDats: ({ commit }) => {
      commit('setLoading', true);
      // async action to get dats
      return catalog.getDats()
        .then(dats => commit('setDats', dats))
        .finally(() => commit('setLoading', false));
    },
    getFiles: ({ commit }, payload) => {
      commit('setLoading', true);
      return catalog.getItemsWith({}, payload)
        .then(files => commit('setDatFiles', { key: payload, files }))
        .finally(() => commit('setLoading', false));
    },
    download: ({ commit }, item) => {
      commit('setLoading', true);
      return catalog.checkout(item)
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
      if (!payload.key) { // need proper validation here
        commit('setLoading', false);
      }
      return catalog.importRemoteDat(payload.key, payload.name) // need to throw errors in promise in dat-cardcat
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
  },
});

export default store;
