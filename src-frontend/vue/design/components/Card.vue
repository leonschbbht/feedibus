<template>
    <v-card
        class="mx-auto"
        :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
    >
        <a
            v-if="img"
            :href="link"
            target="_blank"
        >
            <v-img
                class="white--text align-end img"
                height="300px"
                :src="img"
            >
                <v-card-title class="title">
                    {{ title }}
                </v-card-title>
            </v-img>
        </a>
        <div
            v-else
            class="white--text accent"
        >
            <v-card-title class="title">
                {{ title }}
            </v-card-title>
        </div>
        <v-toolbar
            dense
            flat
            class="secondary white--text"
        >
            <v-icon color="white">
                mdi-access-point
            </v-icon>
            <v-toolbar-title>{{ source }}</v-toolbar-title>
            <v-spacer />
            <v-icon color="white">
                mdi-calendar
            </v-icon>
            <v-toolbar-title> {{ date }}</v-toolbar-title>
        </v-toolbar>
        <div />

        <v-card-text class="text--primary">
            {{ text }}
        </v-card-text>
        <v-card-actions>
            <v-btn
                text
                color="accent"
                :href="link"
                target="_blank"
            >
                Weiterlesen
            </v-btn>
        </v-card-actions>
        <v-card-text>Kategorien:</v-card-text>
        <v-chip-group class="chips">
            <v-chip
                v-for="category in categories"
                :key="category"
                disabled="true"
            >
                {{ category }}
            </v-chip>
        </v-chip-group>
    </v-card>
</template>
<script>
export default {
    props: {
        title: {
            type: String,
            default: ''
        },
        date: {
            type: String,
            default: ''
        },
        img: {
            type: String,
            default: ''
        },
        source: {
            type: String,
            default: ''
        },
        text: {
            type: String,
            default: ''
        },
        link: {
            type: String,
            default: ''
        },
        categories: {
            type: Array,
            default: function () {
                return [];
            }
        }
    }
};
</script>
<style scoped>
.chips {
  margin: 10px;
}
.title {
  text-shadow: 0px 0px 20px black;
  text-decoration: none;
}
.mobile {
  max-width: 100%;
}
.desktop {
  max-width: 60%;
}
a {
    text-decoration: none;
}
.img{
    -webkit-filter: grayscale(30%); /* Safari 6.0 -9.0 */
    filter: grayscale(30%);
}
</style>
