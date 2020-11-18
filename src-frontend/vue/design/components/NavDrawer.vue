<template>
  <v-navigation-drawer v-model="drawer"  temporary fixed >
    <v-list nav dense>
      <v-list-item-group
      active-class="primary--text text--primary-4"
        v-model="group"
      >
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>John Leider</v-list-item-title>
          </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="item in items" :key="item.title" link>
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
</template>
<script>
export default {
  props: { drawer: Boolean, items:Object },
  data() {
    return {
      group: null,
    };
  },
  watch: {
    group() {
      this.drawer = false;
      this.$emit("update:drawer", this.drawer);
    },
    drawer() {
      this.$emit("update:drawer", this.drawer);
    },
  },
};
</script>