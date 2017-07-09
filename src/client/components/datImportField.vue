<template>
  <el-form ref="form">
    <el-form-item label="Library Key">
      <el-input name="key" v-model="key" placeholder="Dat Key"></el-input><br />
    </el-form-item>
    <el-form-item label="Name">
      <el-input name="name" v-model="name" placeholder="Name it"></el-input><br />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" v-on:click="submit($event)">Import</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    name: 'DatImportField',
    components: {},
    data() {
      return {
        key: '',
        name: '',
      };
    },
    methods: {
      ...mapActions(['importDat']),
      submit(event) {
        if (event) event.preventDefault();
        const { key, name } = this;
        this.importDat({ key, name });
      },
    },
};
</script>

<style lang="scss" scoped>
  form {
    margin: 1rem;
  }
</style>
