import Home from './Home.vue'
import FeedManagement from './FeedManagement.vue'
import Settings from './Settings.vue'

export default [
    {
        path: '/index',
        component: Home
    },
    {
        path: '/',
        component: Home
    },
    {
        path: '/home',
        component: Home
    },
    {
        path: '/feeds',
        component: FeedManagement
    },
    {
        path: '/settings',
        component: Settings
    }

]
