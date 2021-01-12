<template>
    <div>
        <v-app-bar
            dense
            color="primary"
            fixed
            app
        >
            <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
            <a href="/">
                <v-img
                    class="mx-2"
                    src="https://i.imgur.com/LQUQZvA.png"
                    max-height="40"
                    max-width="40"
                    contain
                />    </a>
            <v-toolbar-title>feedibus</v-toolbar-title>
        </v-app-bar>
        <v-navigation-drawer
            v-model="drawer"
            temporary
            fixed
        >
            <v-list
                nav
                dense
            >
                <v-list-item-group
                    :value="group"
                    active-class="primary--text text--primary-4"
                    @input="drawer = false"
                >
                    <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        :to="item.to"
                        link
                    >
                        <v-list-item-icon>
                            <v-icon>{{ item.icon }}</v-icon>
                        </v-list-item-icon>

                        <v-list-item-content>
                            <v-list-item-title>{{ item.title }}</v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </v-list-item-group>
            </v-list>
        </v-navigation-drawer>
    </div>
</template>
<script>
export default {
    data () {
        return {
            drawer: false,
            items: [
                { title: 'Login', icon: 'mdi-sparkles', to: '/' },
                { title: 'Registrieren', icon: 'mdi-sparkles', to: '/register' }
            ]
        };
    }
};
</script>
