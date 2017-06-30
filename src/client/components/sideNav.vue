<template>
  <aside>
    <p>Reading lists:</p>
    <ul>
      <li>
        <input type="checkbox" id="coll-all" value="all" v-model="clearCollections" checked>
        <label for="dat-all">All items</label>
      </li>
      <li v-for="(coll, index) in collections">
        <input type="checkbox" :id="`coll-${index}`" :value="coll.collection" v-model="selectedCollections">
        <label :for="`coll-${index}`">{{ coll.collection.replace(';;', ' -> ') }}</label>
      </li>
    </ul>
  </aside>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'sideNav',
    components: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(['collections']),
      clearCollections: {
        get() {
          return (this.$store.state.selectedCollections.length === 0) ? ['all'] : [];
        },
        set() {
          this.$store.commit('selectCollections', []);
          this.$store.dispatch('getAuthorLetters');
        },
      },
      selectedCollections: {
        get() {
          return this.$store.state.selectedCollections;
        },
        set(value) {
          this.$store.commit('selectCollections', value);
          this.$store.dispatch('getAuthorLetters');
        },
      },
    },
    methods: {},
};
</script>

<style lang="scss" scoped>
  aside {
    flex: 0;
    width: 16rem;
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
