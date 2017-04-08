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
  authorList: [],
  searchIndex: null,
  searchQuery: null,
  results: [],
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
    setAuthorList: setIdentity('authorList'),
    setSearchIndex: setIdentity('searchIndex'),
    setDats: setIdentity('dats'),
    selectDats: setIdentity('selectedDats'),
    setResults: setIdentity('results'),
    setSearchQuery: setIdentity('searchQuery'),
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
      return catalog.getAuthorLetters() // TODO: set this relative to selected dats
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
    getAuthorsStartingWith: ({ commit }, payload) => {
      commit('setLoading', true);
      commit('setSearchIndex', payload);
      return catalog.getAuthors(payload) // TODO: set this relative to selected dats
        .then(authors => commit('setAuthorList', authors))
        .finally(() => commit('setLoading', false));
    },
    getFiles: ({ commit }, payload) => {
      commit('setLoading', true);
      return catalog.getItemsWith({}, payload)
        .then(files => commit('setDatFiles', { key: payload, files }))
        .finally(() => commit('setLoading', false));
    },
    search: ({ commit }, payload) => {
      // when searching reset search area.
      commit('setSearchIndex', null);
      commit('setAuthorList', []);
      if (!payload) {
        commit('setSearchQuery', null);
        return Promise.resolve();
      }
      commit('setSearchQuery', payload);
      commit('setLoading', true);
      return catalog.search(payload) // TODO: set this relative to selected dats
        .then(results => commit('setResults', results))
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
