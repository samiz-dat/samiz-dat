<template>
  <div>
    <el-checkbox-button size="small" label="all" key="all" v-model="selectAll" checked>All</el-checkbox-button>
    <el-checkbox-group v-model="selected">
      <el-checkbox v-for="(dat, index) in dats" :label="dat.dat" :key="dat.dat">{{dat.name}}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
  import { mapState, mapActions } from 'vuex';

  // TODO: make this fixed, independent of main areas scroll.

  export default {
    name: 'datNav',
    components: {},
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
          this.$store.dispatch('getAuthorLetters');
        },
      },
      selected: {
        get() {
          return this.$store.state.selectedDats;
        },
        set(value) {
          this.$store.commit('selectDats', value);
          this.$store.dispatch('getAuthorLetters');
        },
      },
    },
    methods: {},
};

</script>

<style lang="scss" scoped>
.el-checkbox-group label.el-checkbox {
  margin-left: 0px;
  display: block;
}
</style>
