<template>
  <div id="home">
    <h2>About Samiz-Dat</h2>
    <div class="content">
      <div class="left">
          <p>
          <span class='quote'>“THE LIBRARY IS A GROWING ORGANISM.”</span><br/>
          <span class='quote'>S.R Ranganathan</span>
          </p>

          <p><b>TLDR;</b></p>

          <p>
          <span>Samiz-Dat is</span>
          <ul>
          <li>a library of libraries</li>
          <li>an approach to archiving</li>
          <li>peer to peer</li>
          <li>between us</li>
          <li>decentralised and distributed</li>
          <li>built by its users/readers</li>
          <li>open source</li>
          <li>free</li>
          <li>an invitation</li>
          <li>an out stretched hand</li>
          <li>cooperation</li>
          <li>a work in progress</li>
          <li>open to suggestion</li>
          <li>for artists, poets, academics, and like-minded friends</li>
          <li>a tool for research</li>
          <li>a way of sharing</li>
          <li>built on top of the <el-button type="text" @click="open('https://datproject.org/')">Dat Protocol</el-button></li>
          <li>not static - this text will be rewritten in future releases</li>
          </ul>
          </p>

          <p><strong>OR:</strong></p>

          <p>
          Let’s say you have a collection of an out-of-print, obscure, radical zine from Sydney in the 1970s; or you have collected the writings of your comrades; or you have a directory of your own texts that are currently unpublished or otherwise inaccessible. With Samiz-Dat you can share them easily with others.
          </p>
          <p>
          Samiz-Dat is a library of libraries. What makes Samiz-Dat libraries special is that there is no central server hosting the files. The files are collectively hosted and distributed by the readers of those libraries. Every one of these libraries have their own public key. Using a library’s key, you can access that library’s content. Sharing the key for your own libraries lets others gain access to yours. By downloading libraries and keeping the application running, you help provide mutual support in the form of disk space and bandwidth and redundancy for the libraries you have downloaded.
          </p>
          <p>
          <strong>How do I use it?</strong>
          </p>
          <p>
          Get started by downloading the starter libraries. Make your own library, or import your personal calibre library. Then share your library’s key with others to start distributing and collectively archiving your collection.
          </p>
          <p>
          Collections are private - you need to share your key with others to make your library accessible. If you would like to share your library from this section of the app, and you hold the permissions to share all the material in your library, please get in touch and we will add your library's key and description to this page in a future release.
          </p>
      </div>
      <div class="right">
        <h3>Get started</h3>
        <p>You can start by trying these libraries. Click on their titles to open the import prompt.</p>
        <ul>
          <li>
            <el-button
              type="text"
              @click="openImportDialog('6f963e59e9948d14f5d2eccd5b5ac8e157ca34d70d724b41cb0f565bc01162bf', 'Frontyard')"
            >
              Frontyard’s Offline Digital Library
            </el-button><br/>
             A selection of texts shared through a.library (an offline digital library) at <el-button type="text" @click="open('https://www.frontyardprojects.org')">frontyard projects</el-button>.
          </li>
          <li>
            <el-button
              type="text"
              @click="openImportDialog('c6ea9ce5627140020b15de05ecb054e8d1a354559e4a0b9b2295d22d87de632b', 'Black Panther Party')"
            >
              Black Panther Party newspaper archive
            </el-button><br/>
             20 volumes of <em>The Black Panther</em> "Black Community News Service", then "Intercommunal News Service", running from 1967-1980. Several hundred issues in PDF format.</el-button>.
          </li>
        </ul>
        <p>Or these made by our friends at <el-button type="text" @click="open('https://www.memoryoftheworld.org/')">Memory of the World</el-button>:</p>
        <ul>
          <li>
            <el-button
              type="text"
              @click="openImportDialog('9c7000896467f2c9a3137affb01363a12caa23b0cdea6d2abe3b7b8de07f752d', 'Praxis')"
            >
              Praxis (digitized).
            </el-button><br/>
            A collection containing the (digitized) issues of Yugoslav, international, special and pocket editions of “Praxis”.
          </li>
          <li>
            <el-button
              type="text"
              @click="openImportDialog('94c7e648c66c1ccab224868d42f66bd9fcc949ee4714935d739555eca2385e45', 'Midnight Notes')"
            >
              Midnight Notes (digitized)
            </el-button><br/>
             A collection compiling the (digitized) issues of issues of Midnight Notes.
          </li>
        </ul>
      </div>
    </div>
    <el-dialog title="Import a remote library" :visible.sync="addRemoteDialogIsVisible">
      <dat-import-field :key="libraryInfo.key" :libraryInfo="libraryInfo"/>
    </el-dialog>
  </div>
</template>

<script>
  import datImportField from 'components/datImportField';
  import { shell } from 'electron';

  export default {
    name: 'home',
    components: {
      datImportField,
    },
    data() {
      return {
        libraryInfo: { key: '', name: '' },
        addRemoteDialogIsVisible: false,
      };
    },
    methods: {
      openImportDialog(key, name) {
        this.libraryInfo = { key, name };
        this.addRemoteDialogIsVisible = true;
      },
      open: (href) => {
        shell.openExternal(href);
      },
    },
};
</script>

<style lang="scss" scoped>
  #home {
    margin: 1rem;
  }
  .content {
    display: flex;
    flex-wrap: nowrap;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    .left, .right {
      width: 50%;
    }
    .right {
      margin-left: 1rem;
    }
    .quote {
      font-size: 1.2em;
      color:#CCC;
    }
  }
</style>
