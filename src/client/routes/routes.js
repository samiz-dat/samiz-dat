import Vue from 'vue';
import VueRouter from 'vue-router';
import authors from 'containers/authors';
import texts from 'containers/texts';
import search from 'containers/search';
import libraries from 'containers/libraries';
import readingLists from 'containers/readingLists';
import home from 'containers/home';
// import ReadingLists from 'containers/readingLists';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: home },
  { path: '/libraries', component: libraries },
  { path: '/reading-lists', component: readingLists },
  { path: '/search',
    component: search,
    children: [
      { path: '', component: texts, props: { display: 'SEARCH' } }, // @TODO: make this shared consts
      { path: 'byAuthor', component: texts, props: { display: 'BY_AUTHOR' } }, // @TODO: make this shared consts
      { path: 'authors', component: authors },
    ],
  },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

// router.replace({ path: '*', redirect: '/' });
export default router;
