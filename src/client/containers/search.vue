<template>
  <div id="search">
    <el-row>
      <el-col :span="24">
        <main>
          <dat-nav/>
          <author-nav :action="showAuthors"/>
          <router-view></router-view>
          <all-texts v-if="isParentSearchRoute"/>
        </main>
      </el-col>
      <!-- <el-col :span="5">
        <side-nav/>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';
  import addFile from 'components/addFile';
  import addReadingList from 'components/addReadingList';
  import readingListNav from 'components/readingListNav';
  import authorNav from 'components/authorNav';
  import datImportField from 'components/datImportField';
  import datNav from 'components/datNav';
  import sideNav from 'components/sideNav';
  import searchNav from 'components/searchNav';
  import allTexts from 'containers/alltexts';

  export default {
    name: 'search',
    components: {
      addFile,
      addReadingList,
      readingListNav,
      authorNav,
      datImportField,
      datNav,
      sideNav,
      searchNav,
      allTexts,
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(['dats', 'loading', 'error', 'route']),
      isParentSearchRoute() {
        // weird hack because vue-router explicitly does not support empty child routes.
        return this.$route.path === '/search';
      },
    },
    methods: {
      ...mapActions(['showAuthorsStartingWith']),
      submit(event) {
        if (event) event.preventDefault();
        console.log(this.search);
      },
      showAuthors(letter) {
        // @todo make letter search part of url params using router link
        this.$router.push({ name: 'authors', params: { letter } });
      },
    },
};
</script>

<style lang="scss" scoped>
  main {
    padding: 1rem;
  }
</style>
