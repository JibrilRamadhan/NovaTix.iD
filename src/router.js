import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from './lib/supabase'
import { useAnalytics } from './composables/useAnalytics'

import HomePage from './pages/HomePage.vue'

const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage
    },
    {
        path: '/portofolio',
        name: 'Portfolio',
        component: () => import('./pages/PortfolioPage.vue')
    },
    {
        path: '/services',
        name: 'Services',
        component: () => import('./pages/ServicesPage.vue')
    },
    {
        path: '/pricing',
        name: 'Pricing',
        component: () => import('./pages/PricingPage.vue')
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('./pages/LoginPage.vue'),
        meta: { guestOnly: true }
    },
    {
        path: '/admin',
        component: () => import('./pages/AdminLayout.vue'),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('./pages/AdminDashboard.vue')
            },
            {
                path: 'portfolio',
                name: 'PortfolioManage',
                component: () => import('./pages/PortfolioManage.vue')
            },
            {
                path: 'pricing',
                name: 'PricingManage',
                component: () => import('./pages/PricingManage.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) return savedPosition
        if (to.hash) {
            return { el: to.hash, behavior: 'smooth', top: 80 }
        }
        return { top: 0 }
    }
})

// Navigation guard
router.beforeEach(async (to, from, next) => {
    const { data: { session } } = await supabase.auth.getSession()

    if (to.meta.requiresAuth && !session) {
        return next({ name: 'Login' })
    } else if (to.meta.guestOnly && session) {
        return next('/admin')
    }

    // Analytics Tracking
    // We use a small timeout to let the page load processing finish
    // and to ensure title/path are updated
    if (!to.path.startsWith('/admin')) { // Don't track admin pages to avoid noise
        const { trackVisit } = useAnalytics()
        // Fire and forget
        trackVisit()
    }

    next()
})

export default router
