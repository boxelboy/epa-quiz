import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import QuizView  from '../views/QuizView.vue';
import ResultsView from "../views/ResultsView.vue";
import analytics from "../helpers/local_analytics";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homeview',
      component: HomeView
    },
    {
      path: '/quiz',
      name: 'quizview',
      component: QuizView
    },
    {
      path: '/results',
      name: 'resultsview',
      component: ResultsView
    }
  ]
})
router.beforeEach((to,from) => {
    analytics(
      "route-change",
      {
        "from_data": from,
        "to_data": to
      }
    );
});

export default router
