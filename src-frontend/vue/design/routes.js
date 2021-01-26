import Home from './page/Home.vue'
import FeedManagement from './page/FeedManagement.vue'
import Settings from './page/Settings.vue'
import Kategorie from './page/KategorieManagement.vue';

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
    },
    {
        path: '/kategorie',
        component: Kategorie
    }

]
