import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from 'dat-cardcat';
import _ from 'lodash';

const dataDir = path.join(process.cwd(), '_data');
const catalog = new Catalog(dataDir);

const INITIAL_STATE = {
  loading: false,
  authorLetters: [],
  authorList: [],
  searchIndex: null,
  searchQuery: null,
  results: [], // need to group results into author/titles with files bundled, not listed seporately.
  dats: [],
  selectedDats: [],
  // files: {},
  error: null,
};

Vue.use(Vuex);

// For a result set with results like [author, title, files]
// unpack the files column...
const unpackTitleFiles = results => _.map(results, (result) => {
  const files = result.files;
  result.files = _.map(_.split(files, ','),
    (file) => {
      const fData = _.split(file, ':');
      return {
        file: fData[0],
        dat: result.dat,
        downloaded: fData[1] === '1',
      };
    });
  result.downloaded = _.every(result.files, 'downloaded');
  return result;
});

const setIdentity = (key, iteratee = _.identity) => (state, payload) => { state[key] = iteratee(payload); };

const store = new Vuex.Store({
  state: INITIAL_STATE,
  mutations: {
    setLoading: setIdentity('loading'),
    setAuthorLetters: setIdentity('authorLetters'),
    setAuthorList: setIdentity('authorList'),
    setSearchIndex: setIdentity('searchIndex'),
    setDats: setIdentity('dats'),
    selectDats: setIdentity('selectedDats'),
    setResults: setIdentity('results', unpackTitleFiles),
    setSearchQuery: setIdentity('searchQuery'),
    // setDatFiles: (state, payload) => {
    //   Vue.set(state.files, payload.key, payload.files);
    // },
    setError: setIdentity('error'),
    resetError: (state) => {
      state.error = null;
    },
  },
  getters: {
    // getDatFiles: state => key => state.files[key],
    datWithKey: state => key => state.dats.find(d => d.dat === key),
    searchDats: state => (state.selectedDats.length === 0 ? undefined : state.selectedDats),
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
    getAuthorLetters: ({ dispatch, commit, state, getters }) => {
      commit('setLoading', true); // TODO: make this a push pop type state, so first return does not stop the loader if other actions have not finished yet...
      return catalog.getAuthorLetters(getters.searchDats)
        .then((rows) => {
          const letters = rows.map(v => v.letter);
          commit('setAuthorLetters', letters);
          const promises = [];
          if (state.searchIndex) {
            if (letters.find(letter => letter === state.searchIndex)) {
              promises.push(dispatch('getAuthorsStartingWith', state.searchIndex));
            } else {
              commit('setSearchIndex', null);
            }
          }
          if (state.searchQuery) {
            promises.push(dispatch('search', state.searchQuery));
          }
          return Promise.all(promises);
        })
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getDats: ({ commit }) => {
      commit('setLoading', true);
      // async action to get dats
      return catalog.getDats()
        .then(dats => commit('setDats', dats))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getAuthorsStartingWith: ({ commit, getters }, payload) => {
      commit('setLoading', true);
      commit('setSearchIndex', payload);
      return catalog.getAuthors(payload, getters.searchDats)
        .then(authors => commit('setAuthorList', authors))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getFilesByAuthor: ({ state, commit, getters }, payload) => {
      commit('setLoading', true);
      commit('setSearchQuery', payload);
      commit('setSearchIndex', null);
      commit('setAuthorList', []);
      return catalog.getTitlesWith({ author: payload }, getters.searchDats)
        .then(results => commit('setResults', results))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    search: ({ getters, commit }, payload) => {
      // when searching reset search area.
      commit('setSearchIndex', null);
      commit('setAuthorList', []);
      if (!payload || payload === '') {
        commit('setSearchQuery', null);
        return Promise.resolve();
      }
      commit('setSearchQuery', payload);
      commit('setLoading', true);
      return catalog.search(payload, getters.searchDats)
        .then(results => commit('setResults', results))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    download: ({ commit }, item) => {
      commit('setLoading', true);
      return catalog.checkout(item)
        .catch(e => commit('setError', e))
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
