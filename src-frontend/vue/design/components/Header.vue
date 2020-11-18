<template>
  <div>
    <v-app-bar dense color="primary" fixed>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <v-img
        class="mx-2"
        src="https://i.imgur.com/LQUQZvA.png"
        max-height="40"
        max-width="40"
        contain
      ></v-img>
      <v-toolbar-title>feedibus</v-toolbar-title>
    </v-app-bar>
    <NavDrawer :drawer.sync="drawer" :items="items" />
  </div>
</template>
<script>
import NavDrawer from "./NavDrawer.vue";
export default {
  components: { NavDrawer },
  data() {
    return {
      drawer: false,
      items: [
        { title: "Startseite", icon: "mdi-home" },
        { title: "Einstellungen", icon: "mdi-settings" },
        { title: "Meine Feeds", icon: "mdi-rss" },
        { title: "Logout", icon: "mdi-power" },
      ],
    };
  },
  methods: {
    setDrawer: function (newValue) {
      this.drawer = newValue;
      console.log(newValue);
    },
  },
};
</script>