<template>
  <div id="dat-library">
    <loader :loading="loading"/>
    <error :error="error"/>
    <main>
      <h1>Dat Library</h1>
    <!-- <button v-on:click="getDats">List dats</button> -->
      <dat-view v-for="dat in dats" :dat="dat" :key="dat.dat"/>
    </main>
    <aside>
      <button v-on:click="loadDirectoryAsDat">Load directory</button>
      <dat-import-field/>
      <ul>
        <li>
          <input type="checkbox" id="dat-all" v-model="selectedDats">
          <label for="dat-all">All libraries</label>
        </li>
        <li v-for="(dat, index) in dats">
          <input type="checkbox" :id="`dat-${index}`" :value="dat.dat" v-model="selectedDats">
          <label :for="`dat-${index}`">{{dat.name}}</label>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import loader from './components/loader.vue';
  import error from './components/error.vue';
  import datImportField from './components/datImportField.vue';
  import DatView from './components/DatView.vue';

  export default {
    name: 'App',
    components: {
      error,
      loader,
      datImportField,
      DatView,
    },
    data() {
      return {
        selectedDats: [],
      };
    },
    created() {
      // initialise catalog on app start
      this.loadCatalog()
        .then(() => this.getDats());
    },
    computed: {
      ...mapState(['dats', 'loading', 'error']),
    },
    methods: {
      ...mapActions(['loadCatalog', 'loadDirectoryAsDat', 'getDats']),
    },
};
</script>

<style lang="scss">
  html {
    height: 100%;
  }

  body, html {
    padding: 0;
    margin: 0;
    width: 100%;
  }

  #dat-library {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    flex-wrap: nowrap;
    justify-content: center;

    aside {
      flex: 0;
      width: 25%;
      border-left: thick black solid;

      button {
        border: solid thin black;
        background-color: white;
        cursor: pointer;
        margin: 1rem;

        &:hover {
          color: white;
          background-color: black;
        }
      }

      ul {
        padding: 0;
        margin: 0;

        li {
          margin: 0;
          padding: 0;
          list-style: none;
          border-top: black solid thin;

          &:last-child {
            border-bottom: black solid thin;
          }
        }

        label {
          display: block;
          padding: 1rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          background-color: #FFF;

          cursor: pointer;


          &:hover {
            background-color: #EEE;
          }
        }
        input[type=checkbox]:checked + label {
          background-color: #FEE;
          &:hover {
            background-color: #EFF;
          }
        }

        input[type=checkbox] {
          display: none;
          opacity: 0;
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 0;
        }
      }

    }

    main {
      flex: 1;
      width: 75%;
      min-height: 100%;
      margin: 1rem;
      overflow: hidden;
    }
  }
</style>
