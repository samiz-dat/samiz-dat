import Vue from 'vue';
import VueRouter from 'vue-router';
import authors from 'containers/authors';
import texts from 'containers/texts';
// import ReadingLists from 'containers/readingLists';

Vue.use(VueRouter);

const routes = [
  { path: '/', component: texts },
  { path: '/search', component: texts, props: { display: 'SEARCH' } }, // @TODO: make this shared consts
  { path: '/byAuthor', component: texts, props: { display: 'BY_AUTHOR' } },
  { path: '/authors', component: authors },
  // { path: '/authors', component: ReadingLists },
];

const router = new VueRouter({
  // mode: 'history',
  routes,
});

// router.replace({ path: '*', redirect: '/' });
export default router;
