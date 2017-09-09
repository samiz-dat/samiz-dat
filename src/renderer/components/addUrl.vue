<template>
  <form method="post" v-show="writeableDats.length !== 0">
    <p>Add a webpage:</p>
    <el-select v-if="!defaultDat" v-model="dat" placeholder="Select a Library">
      <el-option
        v-for="(dat, index) in writeableDats"
        :label="dat.name"
        :key="dat.dat"
        :value="dat.dat">
      </el-option>
    </el-select>
    <el-input name="title" v-model="url" placeholder="URL"></el-input><br />
    <el-button v-on:click="checkUrl($event)" size="mini" v-show="validUrl === false">Load URL</el-button>
    <div>{{ message }}</div>
    <el-input name="author" v-model="author" placeholder="Author" v-show="validUrl === true"></el-input><br />
    <el-input name="title" v-model="title" placeholder="Title" v-show="validUrl === true"></el-input><br />
    <el-button v-on:click="submit($event)" size="mini" v-show="validUrl === true">Add to Library</el-button>
  </form>
</template>

<script>
  import { mapActions, mapState, mapGetters } from 'vuex';
  import request from 'request';
  import extractor from 'unfluff';

  export default {
    name: 'AddUrl',
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
        url: '',
        validUrl: false,
        message: '',
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
        const { author, title, dat, url, defaultDat } = this;
        this.addFileToDat({
          author,
          title,
          dat: defaultDat || dat,
          url,
        })
        .then(() => this.getDatStats())
        .then(() => this.$notify({
          title: 'Page added!',
          message: url,
        }))
        .catch(e => console.log(e));
      },
      checkUrl(event) {
        if (event) event.preventDefault();
        const { url } = this;
        console.log(url);
        request.get(url, (err, res, body) => {
          if (err) { this.message = 'There was a problem with that url'; }
          if (res.statusCode !== 200) {
            this.message = 'There was a problem loading that url';
          } else {
            this.validUrl = true;
            const data = extractor.lazy(body);
            this.message = 'Please check the author and title below';
            this.title = data.title();
            this.author = data.author().join('; ');
            console.log(data.text());
          }
        });
      },
    },
};
</script>
