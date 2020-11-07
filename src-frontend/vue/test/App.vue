<template>
    <v-app>
        <v-toolbar
            dark
            class="indigo"
        >
            <v-toolbar-title class="headline text-uppercase">
                <span>Vuetify &nbsp;</span>
                <span class="font-weight-light">MATERIAL DESIGN</span>
            </v-toolbar-title>
            <v-spacer />
            <v-btn
                href="https://github.com/vuetifyjs/vuetify/releases/latest"
                target="_blank"
            >
                <span class="mr-2">Latest Release</span>
            </v-btn>
        </v-toolbar>

        <v-main>
            <h1>Hallo Welt</h1>
        </v-main>
    </v-app>
</template>

<script>
export default {
    name: 'App'
}
</script>
