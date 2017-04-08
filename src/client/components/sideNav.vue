<template>
  <aside>
    <button v-on:click="loadDirectoryAsDat">+ Local Library</button>
    <dat-import-field/>
    <p>Selected libraries:</p>
    <ul>
      <li>
        <input type="checkbox" id="dat-all" value="all" v-model="selectAll" checked>
        <label for="dat-all">All libraries</label>
      </li>
      <li v-for="(dat, index) in dats">
        <input type="checkbox" :id="`dat-${index}`" :value="dat.dat" v-model="selected">
        <label :for="`dat-${index}`">{{dat.name}}</label>
      </li>
    </ul>
  </aside>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import datImportField from 'components/datImportField';

  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'sideNav',
    components: {
      datImportField,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(['dats']),
      selectAll: {
        get() {
          return (this.$store.state.selectedDats.length === 0) ? ['all'] : [];
        },
        set() {
          this.$store.commit('selectDats', []);
        },
      },
      selected: {
        get() {
          return this.$store.state.selectedDats;
        },
        set(value) {
          this.$store.commit('selectDats', value);
        },
      },
    },
    methods: {
      ...mapActions(['loadDirectoryAsDat']),
    },
};
</script>

<style lang="scss" scoped>
  aside {
    flex: 0;
    width: 25%;
    border-left: thick black solid;

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
        transition: color ease 300ms, background-color ease 300ms;


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
</style>
