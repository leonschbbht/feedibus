import Home from './Home.vue'
import Header from './components/Header.vue'
import FeedManagement from './FeedManagement.vue'
export default [
    {
        path: '/index',
        component: Home,
    },
    {
        path: '/',
        component: Home,
    },
    {
        path: '/home',
        component: Home,
    },
    {
        path: '/feeds',
        component: FeedManagement
    }

]