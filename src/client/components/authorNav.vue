<template>
  <div>
  <el-button-group>
    <el-button v-for="(letter, index) in allLetters"
    :key="letter"
    @click="action(letter)"
    :disabled="!authorLetters.includes(letter)"
    size="mini"
    >
      {{letter}}
    </el-button>
  </el-button-group>
  </div>
</template>

<script>
  import { mapState } from 'vuex';

  export default {
    name: 'authorNav',
    components: {},
    props: {
      action: {
        type: Function,
        required: true,
      },
    },
    data() {
      return {};
    },
    computed: {
      ...mapState(['allLetters', 'authorLetters']),
    },
};
</script>
