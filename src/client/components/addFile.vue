<template>
  <form method="post">
    <p>Add a file:</p>
    <el-select v-model="dat" placeholder="Select a Library">
      <el-option
        v-for="(dat, index) in dats"
        :label="dat.name"
        :key="dat.dat"
        :value="dat.dat">
      </el-option>
    </el-select>
    <el-button v-on:click="findFileDialog">{{ file }}</el-button><br />
    <el-input name="author" v-model="author" placeholder="Author"></el-input><br />
    <el-input name="title" v-model="title" placeholder="Title"></el-input><br />
    <el-button v-on:click="submit($event)" size="mini">Add</el-button>
  </form>
</template>

<script>
  import { mapActions, mapState } from 'vuex';
  import { remote } from 'electron';

  export default {
    name: 'AddFile',
    components: {},
    data() {
      return {
        author: '',
        title: '',
        dat: '',
        file: 'Select a file',
      };
    },
    computed: {
      ...mapState(['dats']),
    },
    methods: {
      ...mapActions(['addFileToDat']),
      submit(event) {
        if (event) event.preventDefault();
        const { author, title, dat, file } = this;
        this.addFileToDat({ author, title, dat, file });
      },
      findFileDialog() {
        remote.dialog.showOpenDialog({
          title: 'Find file',
          properties: ['openFile'],
        }, (file) => {
          if (Array.isArray(file)) {
            this.file = file[0];
          }
        });
      },
    },
};
</script>
