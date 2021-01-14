import Vue from 'vue';
import App from './App.vue';
import vuetify from '../plugins/vuetify'; // path to vuetify export
import VueRouter from 'vue-router';
import routes from './routes';

Vue.config.productionTip = false;
Vue.use(VueRouter);

const router = new VueRouter({
    routes: routes
})
new Vue({
    vuetify,
    router,
    render: h => h(App)
}).$mount('#app');
