import Home from './Home.vue'
import FeedManagement from './FeedManagement.vue'
import Settings from './Settings.vue'
import Register from './Register.vue'
import Login from './Login.vue'
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
        path: '/register',
        component: Register
    },
    {
        path: '/login',
        component: Login
    }

]
