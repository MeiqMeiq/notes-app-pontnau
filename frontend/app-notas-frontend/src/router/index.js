import { createRouter, createWebHistory } from 'vue-router'
import ActiveNotesView from '../views/ActiveNotesView.vue'
import ArchivedNotesView from '../views/ArchivedNotesView.vue'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'active-notes',
      component: ActiveNotesView
    },
    {
      path: '/archived',
      name: 'archived-notes',
      component: ArchivedNotesView
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router
