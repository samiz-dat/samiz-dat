<template>
  <div>
  <el-button-group>
    <el-button v-for="(letter, index) in allLetters"
    :key="letter"
    @click="showAuthorsStartingWith(letter)"
    :disabled="!authorLetters.includes(letter)"
    size="mini"
    >
      {{letter}}
    </el-button>
  </el-button-group>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex';

  export default {
    name: 'authorNav',
    components: {},
    data() {
      return {};
    },
    computed: {
      ...mapState(['allLetters', 'authorLetters'])
    },
    methods: {
      ...mapActions(['showAuthorsStartingWith']),
    },
};
</script>
