import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from 'dat-cardcat';
import _ from 'lodash';

const dataDir = path.join(process.cwd(), '_data');
// this should probably also be stored in state.
const catalog = new Catalog(dataDir);

const INITIAL_STATE = {
  loading: false,
  route: '', // in liue of a need for real routing - use simple string for conditional display.
  page: 0,
  pagerLimit: 3,
  pagerOffset: 0,
  authorLetters: [],
  selectedLetter: null,
  allLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  authorList: [],
  searchQuery: null,
  results: [], // need to group results into author/titles with files bundled, not listed seporately.
  dats: [],
  selectedDats: [],
  availableReadingLists: [],
  readingLists: [],
  selectedReadingLists: [],
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
    setRoute: setIdentity('route'),
    setPagerLimit: setIdentity('pagerLimit'),
    setPage: (state, p) => {
      state.page = p;
      state.pagerOffset = state.pagerLimit * (p - 1);
    },
    setAuthorLetters: setIdentity('authorLetters'),
    setAuthorList: setIdentity('authorList'),
    setSelectedLetter: setIdentity('selectedLetter'),
    setDats: setIdentity('dats'),
    selectDats: setIdentity('selectedDats'),
    setAvailableReadingLists: setIdentity('availableReadingLists'),
    setReadingLists: setIdentity('readingLists'),
    selectReadingLists: setIdentity('selectedReadingLists'),
    setResults: setIdentity('results', unpackTitleFiles),
    setSearchQuery: setIdentity('searchQuery'),
    // setDatFiles: (state, payload) => {
    //   Vue.set(state.files, payload.key, payload.files);
    // },
    setError: setIdentity('error'),
    resetError: (state) => {
      state.error = null;
    },
    clearDats: (state) => {
      state.selectedDats = [];
    },
  },
  getters: {
    // getDatFiles: state => key => state.files[key],
    onSearchPage: state => state.route === 'search', // if this starts to get complex we should implement vue-router
    onAuthorsPage: state => state.route === 'authors',
    onReadingList: state => state.route === 'reading-list',
    datWithKey: state => key => state.dats.find(d => d.dat === key),
    searchDats: state => (state.selectedDats.length === 0 ? undefined : state.selectedDats),
    readingListsFilter: state => (state.selectedReadingLists.length === 0 ? undefined : state.selectedReadingLists),
    uniqueReadingLists: state => (filter) => {
      const unique = [];
      for (const rl of state.readingLists) {
        const valid = (!filter || (filter && rl.collection.indexOf(filter) === 0 && filter.length < rl.collection.length));
        if (valid) {
          const level = (filter)
            ? rl.collection.replace(`${filter};;`, '').split(';;')[0]
            : rl.collection.split(';;')[0];
          if (!unique.includes(level)) {
            unique.push(level);
          }
        }
      }
      return unique;
    },
  },
  // later we should refactor this into a seporate file
  actions: {
    loadCatalog: ({ dispatch, commit, state }) => {
      commit('setLoading', true);
      catalog.on('import', (obj) => {
        // console.log(obj);
        if (!state.setLoading) {
          dispatch('getDats');
          dispatch('getAuthorLetters');
        }
      });
      return catalog.init()
        .then(() => dispatch('getReadingLists'))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    // @TODO: this should be renamed to better describe its actual action. it also reloads searchs/authors
    getAuthorLetters: ({ dispatch, commit, state, getters }) => {
      commit('setLoading', true); // TODO: make this a push pop type state, so first return does not stop the loader if other actions have not finished yet...
      commit('setRoute', 'authors');
      return catalog.getAuthorLetters({ collection: getters.readingListsFilter }, getters.searchDats)
        .then((rows) => {
          const letters = rows.map(v => v.letter);
          commit('setAuthorLetters', letters);
          const promises = [];
          if (state.selectedLetter) {
            if (letters.find(letter => letter === state.selectedLetter)) {
              promises.push(dispatch('showAuthorsStartingWith', state.selectedLetter));
            } else {
              commit('setSelectedLetter', null);
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
    showAuthorsStartingWith: ({ state, commit, getters, dispatch }, payload) => {
      commit('setSelectedLetter', payload);
      commit('setRoute', 'authors');
      commit('setPage', 1);
      return dispatch('getAuthors');
    },
    getAuthors: ({ state, commit, getters }) => {
      commit('setLoading', true);
      return catalog.getAuthors(state.selectedLetter, { collection: getters.readingListsFilter, limit: state.pagerLimit, offset: state.pagerOffset }, getters.searchDats)
        .then(authors => commit('setAuthorList', authors))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getFilesByAuthor: ({ state, commit, getters }, payload) => {
      commit('setLoading', true);
      commit('setSearchQuery', payload);
      commit('setSelectedLetter', null);
      commit('setRoute', 'search');
      commit('setAuthorList', []);
      return catalog.getTitlesWith({ author: payload, collection: getters.readingListsFilter }, getters.searchDats)
        .then(results => commit('setResults', results))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getAvailableReadingLists: ({ commit }) => {
      commit('setLoading', true);
      return catalog.getAvailableCollections()
        .then(collections => commit('setAvailableReadingLists', collections))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    loadReadingList: ({ dispatch, commit }, payload) => {
      commit('setLoading', true);
      console.log(payload[0], payload[1]);
      return catalog.ingestDatCollection(payload[0], payload[1])
      .then(() => dispatch('getReadingLists'))
      .catch(e => commit('setError', e))
      .finally(() => commit('setLoading', false));
    },
    getReadingLists: ({ commit, getters }, payload) => {
      commit('setLoading', true);
      commit('setSelectedLetter', payload);
      return catalog.getCollections(payload)
        .then(collections => commit('setReadingLists', collections))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    search: ({ state, getters, commit }, payload) => {
      // when searching reset search area.
      // we could bundle these state changes into a single commit type
      commit('setPage', 1);
      commit('setSelectedLetter', null);
      commit('setAuthorList', []);
      if (!payload || payload === '') {
        commit('setSearchQuery', null);
        return Promise.resolve();
      }
      commit('setSearchQuery', payload);
      commit('setLoading', true);
      commit('setRoute', 'search');
      return catalog.search(payload, getters.searchDats, { limit: state.pagerLimit, offset: state.pagerOffset })
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
      return catalog.importDat(payload.key, payload.name) // need to throw errors in promise in dat-cardcat
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
  },
});

export default store;
