<template>
  <div id="home">
    <div>
      <h2>Local Branch of Dat Library</h2>
      <p>
      Intentions victorious truth evil aversion morality christian love. Salvation morality prejudice faithful christianity zarathustra ultimate decrepit ascetic philosophy intentions convictions intentions. Eternal-return sexuality right salvation burying will reason ubermensch salvation. Moral endless ideal zarathustra joy. Morality snare christianity intentions enlightenment ultimate aversion. Burying right convictions battle free philosophy contradict contradict virtues contradict pious ubermensch victorious virtues. You might add <el-button type="text" @click="openImportDialog('1943c202c68e66231ec5c2bde9e17ff6103011176515931fcb8eed3415ba8849', 'Random')">Another hosted by Dat Library</el-button>
      </p><p>
      Or there is this one: <el-button type="text" @click="openImportDialog('ea17a8f2a05b6dc7f8556ec76b77b966004dec711c313bb8564a4895e2955cc0', 'Grr')">The Grr Testing Library</el-button>.
      Madness dead spirit aversion grandeur justice horror pious. Burying passion madness law pinnacle overcome spirit marvelous oneself deceptions ocean horror transvaluation society.
      </p><p>
      Of sea endless noble revaluation pious. Philosophy abstract virtues christianity evil. Ocean fearful selfish abstract gains spirit joy contradict.
      </p><p>
      Moral pinnacle derive oneself pinnacle. Ocean reason disgust victorious war fearful. Ascetic ultimate derive against against morality spirit deceptions burying noble prejudice. Chaos philosophy intentions christian inexpedient burying joy ocean love.
      </p><p>
      Ascetic ultimate ascetic burying self love abstract of. Christianity pinnacle right ideal horror. Holiest depths battle chaos hope of overcome holiest virtues morality grandeur madness against. Pinnacle virtues war spirit chaos virtues grandeur pious ubermensch revaluation of horror contradict value. Oneself christianity merciful derive ocean pious prejudice derive marvelous derive madness. Insofar truth joy of ideal.
      </p><p>
      Insofar decieve burying moral of horror transvaluation gains holiest. Depths against decrepit society marvelous. Inexpedient love suicide free pious superiority strong. Joy snare against ideal transvaluation deceptions enlightenment battle. Superiority burying chaos christian passion play dead will ubermensch suicide truth moral free. Convictions contradict philosophy morality superiority ocean superiority law derive ultimate philosophy oneself god.
      </p><p>
      Burying pinnacle ocean merciful philosophy against enlightenment convictions spirit. Depths value self abstract holiest.
      </p><p>
      Hope faithful war good moral justice holiest grandeur burying deceptions mountains love overcome sea. Madness ultimate transvaluation right ideal ultimate hatred love ultimate. Salvation transvaluation endless self eternal-return decrepit burying endless. Holiest holiest revaluation deceptions joy strong fearful christianity. Convictions convictions faith passion convictions value.
      </p>
    </div>
    <el-dialog title="Import a remote library" :visible.sync="addRemoteDialogIsVisible">
      <dat-import-field :libraryInfo="libraryInfo"/>
    </el-dialog>
  </div>
</template>

<script>
  import datImportField from 'components/datImportField';

  export default {
    name: 'home',
    components: {
      datImportField,
    },
    data() {
      return {
        libraryInfo: { key:'', name:'' },
        addRemoteDialogIsVisible: false,
      };
    },
    methods: {
      openImportDialog(key, name) {
        this.libraryInfo = { key, name };
        this.addRemoteDialogIsVisible = true;
      },
    },
};
</script>

<style lang="scss" scoped>
  #home {
    margin: 1rem;
  }
</style>
