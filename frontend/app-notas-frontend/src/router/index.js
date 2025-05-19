import { createRouter, createWebHistory } from 'vue-router'
import ActiveNotesView from '../views/ActiveNotesView.vue'
import ArchivedNotesView from '../views/ArchivedNotesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
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
    }
  ]
})

export default router
