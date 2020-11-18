<template>
  <v-card class="mx-auto" max-width="60%">
    <v-img class="white--text align-end" height="300px" :src="img">
      <v-card-title class="title">{{ title }}</v-card-title>
    </v-img>
    <v-toolbar dense flat class="secondary white--text">
      <v-icon color ='white'>mdi-access-point</v-icon>
      <v-toolbar-title>{{ source }}</v-toolbar-title> <v-spacer />
      <v-icon color ='white'>mdi-calendar</v-icon>
      <v-toolbar-title> {{ date }}</v-toolbar-title>
    </v-toolbar>
    <div></div>

    <v-card-text class="text--primary">
      {{ text }}
    </v-card-text>
    <v-card-actions>
      <v-btn text color="accent" :href="link" target="_blank">
        Weiterlesen
      </v-btn>
    </v-card-actions>
    <v-card-text>Kategorien:</v-card-text>
    <v-chip-group class="chips">
      <v-chip v-for="category in categories" disabled="true" :key="category">
        {{ category }}
      </v-chip>
    </v-chip-group>
  </v-card>
</template>
<script>
export default {
  props: {
    title: String,
    date: String,
    img: String,
    source: String,
    text: String,
    link: String,
    categories: Array,
  },
};
</script>
<style scoped>
.chips {
  margin: 10px;
}
.title{
  text-shadow: 0px 0px 20px black;

}
</style>