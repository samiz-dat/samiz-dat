import Vue from 'vue';
import Vuex from 'vuex';
import path from 'path';
import { remote } from 'electron';
import { Catalog } from 'dat-cardcat';
import _ from 'lodash';

const dataDir = path.join(process.cwd(), '_data');
const catalog = new Catalog(dataDir);

// THIS IS JUST TEMPORARILY HERE TO HELP DEBUG ELECTRON ERRORS
// DELAYING ERRORS UNTIL CONSOLE IS ACTIVE SO WE CAN READ THEM
// let catalog;
// setTimeout(() => {
//   catalog = new Catalog(dataDir);
// }, 2000);

const INITIAL_STATE = {
  loading: false,
  fetching: false, // for when fetching new page data - stop page syncs calling update actions
  page: 0,
  pagerLimit: 3,
  pagerOffset: 0,
  selectedLetter: null,
  authorLetters: [],
  allLetters: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
  // authorList: [],
  searchQuery: null,
  results: [],
  dats: [],
  selectedDats: [],
  availableReadingLists: [],
  readingLists: [],
  selectedReadingLists: [],
  datStats: {},
  downloadStat: {},
  // files: {},
  error: null,
};

Vue.use(Vuex);

// For a result set with results like [author, title, files]
// unpack the files column...
const unpackTitleFiles = results => _.map(results, (result) => {
  const files = result.files;
  result.files = _.map(_.split(files, ';;'),
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
    setFetching: setIdentity('fetching'),
    setPagerLimit: setIdentity('pagerLimit'),
    setPage: (state, p) => {
      state.page = p;
      state.pagerOffset = state.pagerLimit * (p - 1);
    },
    refreshPagination: (state) => {
      state.fetching = true;
      state.page = 1;
      state.pagerOffset = 0;
      state.results = [];
    },
    setAuthorLetters: setIdentity('authorLetters'),
    // setAuthorList: setIdentity('authorList'),
    setSelectedLetter: setIdentity('selectedLetter'),
    setDats: setIdentity('dats'),
    selectDats: setIdentity('selectedDats'),
    setAvailableReadingLists: setIdentity('availableReadingLists'),
    setReadingLists: setIdentity('readingLists'),
    selectReadingLists: setIdentity('selectedReadingLists'),
    setResults: setIdentity('results'),
    setSearchQuery: setIdentity('searchQuery'),
    setDownloadStat: setIdentity('downloadStat'),
    setDatStats: setIdentity('datStats'),
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
    datWithKey: state => key => state.dats.find(d => d.dat === key),
    searchDats: state => (state.selectedDats.length === 0 ? undefined : state.selectedDats),
    writeableDats: state => state.dats.filter(d => d.writeable === true),
    datStats: state => key => (_.has(state.datStats, key)) ? state.datStats[key] : {},
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
      catalog.on('download', (data) => {
        commit('setDownloadStat', data);
        dispatch('getDatStats');
      });
      return catalog.init()
        .then(() => dispatch('getReadingLists'))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    // @TODO: this should be renamed to better describe its actual action. it also reloads searchs/authors
    getAuthorLetters: ({ dispatch, commit, state, getters }) => {
      commit('setLoading', true); // TODO: make this a push pop type state, so first return does not stop the loader if other actions have not finished yet...
      return catalog.getAuthorLetters({ collection: getters.readingListsFilter, dat: getters.searchDats })
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
    getDats: ({ dispatch, commit }) => {
      commit('setLoading', true);
      // async action to get dats
      return catalog.getDats()
        .then(dats => commit('setDats', dats))
        .then(() => dispatch('getDatStats'))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    getDatStats: ({ commit }) =>
      // async action to get dats
       catalog.getDats()
        .then((dats) => {
          const stats = {};
          for (const d of dats) {
            stats[d.dat] = catalog.getDatStats(d.dat);
          }
          commit('setDatStats', stats);
        })
        .catch(e => commit('setError', e)),
    newSearch: ({ commit, dispatch }, payload) => {
      // when searching reset search area.
      // we could bundle these state changes into a single commit type
      commit('refreshPagination');
      commit('setSelectedLetter', null);
      if (!payload || payload === '') {
        commit('setSearchQuery', null);
        return Promise.resolve();
      }
      commit('setSearchQuery', payload);
      return dispatch('search');
    },
    search: ({ state, getters, commit }) => {
      commit('setLoading', true);
      return catalog.search(state.searchQuery, { limit: state.pagerLimit, offset: state.pagerOffset, dat: getters.searchDats })
        .then(results => commit('setResults', unpackTitleFiles(results)))
        .catch(e => commit('setError', e))
        .finally(() => {
          commit('setLoading', false);
          commit('setFetching', false);
        });
    },
    showAuthorsStartingWith: ({ state, commit, getters, dispatch }, payload) => {
      commit('refreshPagination');
      return dispatch('getAuthors', payload);
    },
    getAuthors: ({ state, commit, getters }, payload) => {
      commit('setLoading', true);
      return catalog.getAuthors(payload, { collection: getters.readingListsFilter, limit: state.pagerLimit, offset: state.pagerOffset, dat: getters.searchDats })
        .then(authors => commit('setResults', authors))
        .catch(e => commit('setError', e))
        .finally(() => {
          commit('setLoading', false);
          commit('setFetching', false);
        });
    },
    showFilesByAuthor: ({ state, commit, getters, dispatch }, payload) => {
      commit('setSearchQuery', payload); // these can be passed via routes and dont need to be in store
      commit('refreshPagination');
      return dispatch('getFilesByAuthor', payload);
    },
    getFilesByAuthor: ({ state, commit, getters }, payload) => {
      commit('setLoading', true);
      return catalog.getTitlesWith({ author: payload, collection: getters.readingListsFilter, dat: getters.searchDats, limit: state.pagerLimit, offset: state.pagerOffset })
        .then(results => commit('setResults', unpackTitleFiles(results)))
        .catch(e => commit('setError', e))
        .finally(() => {
          commit('setLoading', false);
          commit('setFetching', false);
        });
    },
    showEverything: ({ commit, dispatch }) => {
      commit('refreshPagination');
      return dispatch('getEverything');
    },
    getEverything: ({ state, commit, getters }) => {
      commit('setLoading', true);
      return catalog.getTitlesWith({ collection: getters.readingListsFilter, dat: getters.searchDats, limit: state.pagerLimit, offset: state.pagerOffset })
        .then(results => commit('setResults', unpackTitleFiles(results)))
        .catch(e => commit('setError', e))
        .finally(() => {
          commit('setLoading', false);
          commit('setFetching', false);
        });
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
    download: ({ commit }, item) => {
      commit('setLoading', true);
      return catalog.checkout(item)
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    loadDirectoryAsDat: ({ dispatch, commit }) => {
      // need to figure out setting simple name too
      // or just derive from the directory and let user rename later.
      commit('setLoading', true);
      remote.dialog.showOpenDialog({
        properties: ['openDirectory'],
      }, (file) => {
        if (Array.isArray(file)) {
          catalog.importDir(file[0])
          .then(() => dispatch('getDats'))
          .catch(e => commit('setError', e))
          .finally(() => commit('setLoading', false));
        } else {
          commit('setLoading', false);
        }
      });
    },
    createDirectoryAsDat: ({ dispatch, commit }) => {
      // need to figure out setting simple name too
      // or just derive from the directory and let user rename later.
      commit('setLoading', true);
      remote.dialog.showOpenDialog({
        title: 'Create a new collection',
        defaultPath: dataDir,
        properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      }, (file) => {
        if (Array.isArray(file)) {
          catalog.createDat(file[0])
          .then(() => dispatch('getDats'))
          .catch(e => commit('setError', e))
          .finally(() => commit('setLoading', false));
        } else {
          commit('setLoading', false);
        }
      });
    },
    importDat: ({ dispatch, commit }, payload) => {
      commit('setLoading', true);
      if (!payload.key) { // need proper validation here
        commit('setLoading', false);
      }
      return catalog.importDat(payload.key, payload.name) // need to throw errors in promise in dat-cardcat
        .then(() => dispatch('getDats'))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    removeDat: ({ dispatch, commit }, payload) => {
      commit('setLoading', true);
      if (!payload) { // need proper validation here
        commit('setLoading', false);
      }
      return catalog.removeDat(payload) // need to throw errors in promise in dat-cardcat
        .then(() => dispatch('getDats'))
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
    addFileToDat: ({ commit }, payload) => {
      commit('setLoading', true);
      if (!payload.key) { // need proper validation here
        commit('setLoading', false);
      }
      return catalog.addFileToDat(payload.file, payload.dat, payload.author, payload.title) // need to throw errors in promise in dat-cardcat
        .catch(e => commit('setError', e))
        .finally(() => commit('setLoading', false));
    },
  },
});

export default store;
