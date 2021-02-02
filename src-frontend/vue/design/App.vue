<template>
    <v-app>
        <v-main>
            <Header />
            <main>
                <router-view />
            </main>
            <Footer />
        </v-main>
    </v-app>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
export default {
    name: 'App',
    components: {
        Header,
        Footer
    },
    data () {
        return {
            darkmodeActive: false
        };
    },
    created () {
        if (this.readDarkModeCooke() === 'true') {
            this.$vuetify.theme.dark = true;
        }
    },
    methods: {
        readDarkModeCooke () {
            const name = 'darkmodeActive=';
            const decodedCookie = decodeURIComponent(document.cookie);
            const allCookies = decodedCookie.split(';');
            for (let i = 0; i < allCookies.length; i++) {
                let cookie = allCookies[i];
                while (cookie.charAt(0) === ' ') {
                    cookie = cookie.substring(1);
                }
                if (cookie.indexOf(name) === 0) {
                    return cookie.substring(name.length, cookie.length);
                }
            }
            return '';
        }
    }
};
</script>
