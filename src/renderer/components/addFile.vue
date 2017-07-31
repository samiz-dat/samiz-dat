<template>
  <form method="post" v-show="writeableDats.length !== 0">
    <p>Add a file:</p>
    <el-select v-if="!defaultDat" v-model="dat" placeholder="Select a Library">
      <el-option
        v-for="(dat, index) in writeableDats"
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
  import { mapActions, mapState, mapGetters } from 'vuex';
  import { remote } from 'electron';

  export default {
    name: 'AddFile',
    components: {},
    props: {
      defaultDat: {
        type: String,
      },
      onSubmit: {
        type: Function,
      },
    },
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
      ...mapGetters(['writeableDats']),
    },
    methods: {
      ...mapActions(['addFileToDat', 'getDatStats']),
      submit(event) {
        if (event) event.preventDefault();
        if (this.onSubmit) this.onSubmit();
        const { author, title, dat, file, defaultDat } = this;
        this.addFileToDat({
          author,
          title,
          dat: defaultDat || dat,
          file,
        })
        .then(() => this.getDatStats())
        .then(() => this.$notify({
          title: 'File added!',
          message: file.join('<br/>'),
        }))
        .catch(e => console.log(e));
      },
      findFileDialog() {
        remote.dialog.showOpenDialog({
          title: 'Find file',
          properties: ['openFile', 'multiSelections'],
        }, (file) => {
          if (Array.isArray(file)) {
            this.file = file;
          }
        });
      },
    },
};
</script>
