<template>
  <div class="spacing">
  <div id="mainNav" class="extra-light-grey-bg">
    <div class="menu">
      <el-menu :router="true" :default-active="$route.path" mode="horizontal">
        <el-menu-item index="/search">Browse</el-menu-item>
        <el-menu-item index="/libraries">Libraries</el-menu-item>
        <el-menu-item index="/">Info</el-menu-item>
        <!-- <el-menu-item index="/reading-lists">reading lists</el-menu-item> -->
      </el-menu>
    </div>
    <div class="search">
      <search-nav />
    </div>
  </div>
  </div>
</template>


<script>
  import searchNav from 'components/searchNav';

  export default {
    name: 'mainNav',
    components: {
      searchNav,
    },
    data() {
      return {};
    },
};
</script>

<style lang="scss" scoped>
  .spacing {
    height: 4rem;
  }
  #mainNav {
    position: fixed;
    top:0;
    left: 0;
    right: 0;
    z-index: 2000;
    height: 4rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    div {
      display: flex;
    }
    div.menu {
      align-self: flex-end;
      flex-wrap: nowrap;
      flex-grow: 2;
      flex-shrink: 0;
      white-space: nowrap;
    }
    div.search {
      flex-shrink: 3;
    }
  }
  .extra-light-grey-bg {
    background-color: #EFF2F7;
  }
</style>

