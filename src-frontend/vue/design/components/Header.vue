<template>
    <div>
        <v-app-bar
            dense
            color="primary"
            fixed
            app
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <v-img
                class="mx-2"
                src="https://i.imgur.com/LQUQZvA.png"
                max-height="40"
                max-width="40"
                contain
            />
            <v-toolbar-title>feedibus</v-toolbar-title>
        </v-app-bar>
        <NavDrawer
            :drawer="drawer"
            :items="items"
            @update="setDrawer($event)"
        />
    </div>
</template>
<script>
import NavDrawer from './NavDrawer.vue';
export default {
    components: { NavDrawer },
    data () {
        return {
            drawer: false,
            items: [
                { title: 'Startseite', icon: 'mdi-home', to: '/' },
                { title: 'Einstellungen', icon: 'mdi-settings', to: '/settings' },
                { title: 'Meine Feeds', icon: 'mdi-rss', to: '/feeds' },
                { title: 'Logout', icon: 'mdi-power', to: '/logout' }
            ]
        };
    },
    methods: {
        setDrawer: function (newValue) {
            this.drawer = newValue;
            console.log(newValue);
        }
    }
};
</script>
