import {createRouter, createWebHistory} from 'vue-router'
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import AdminLayout from "../layouts/AdminLayout.vue";

const routes = [
    {path: '/login', component: Login},
    {
        path: '/',
        component: Dashboard,
        meta: {requiresAuth: true, layout: AdminLayout},
        children: [
            { path: 'dashboard', component: Dashboard },
        ],
    },
    {path: '/:pathMatch(.*)*', redirect: '/login'}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

// navigation guard to protect /dashboard
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('auth_token')
    if (to.meta.requiresAuth && !token) {
        return next('/login')
    }
    next()
})

export default router
