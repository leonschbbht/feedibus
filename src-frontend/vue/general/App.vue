<template>
    <v-app>
        <v-main>
            <main>
                <Logo />
                <router-view />
            </main>
        </v-main>
    </v-app>
</template>

<script>
import Logo from './components/Logo.vue';

export default {
    name: 'App',
    components: {
        Logo
    },
    data () {
        return {};
    }
};
</script>
