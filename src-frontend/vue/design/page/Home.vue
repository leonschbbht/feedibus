<template>
    <div>
        <v-data-iterator
            v-if="!onboarding"
            :items="filteredNews"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            disable-pagination
        >
            <template #header>
                <v-toolbar
                    dark
                    color="secondary"
                    class="toolBar"
                >
                    <template>
                        <v-select
                            v-model="filter"
                            flat
                            :chips="!$vuetify.breakpoint.mobile"
                            multiple
                            solo-inverted
                            hide-details
                            :items="news.map((a) => a.tags.map((t) => t.name).flat()).flat()"
                            prepend-inner-icon="mdi-filter-variant"
                            label="Filter auswählen"
                            @change="changed()"
                        >
                            <template
                                v-if="!$vuetify.breakpoint.mobile"
                                #selection="{ attrs, item, select, selected, index }"
                            >
                                <v-chip
                                    v-if="index < 5"
                                    v-bind="attrs"
                                    :input-value="selected"
                                    close
                                    @click="select"
                                    @click:close="remove(item.id)"
                                >
                                    <strong>{{ item }}</strong>
                                </v-chip>
                                <span
                                    v-if="index === 5"
                                    class="grey--text caption"
                                >
                                    (+{{ filter.length - 5 }} )
                                </span>
                            </template>
                            <template
                                v-else
                                #selection="{ item, selected, index }"
                            >
                                <v-chip
                                    v-if="index === 0"
                                    :input-value="selected"
                                    :color="item.color"
                                >
                                    <span>{{ item }}</span>
                                </v-chip>
                                <span
                                    v-if="index === 1"
                                    class="grey--text caption"
                                >
                                    (+{{ filter.length - 1 }} )
                                </span>
                            </template>
                        </v-select>
                        <v-spacer />
                        <v-btn-toggle
                            v-model="sortDesc"
                            mandatory
                        >
                            <v-btn
                                large
                                :class="{ primary: !sortDesc, secondary: sortDesc }"
                                :value="false"
                            >
                                <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                                large
                                :class="{ primary: sortDesc, secondary: !sortDesc }"
                                :value="true"
                            >
                                <v-icon>mdi-arrow-down</v-icon>
                            </v-btn>
                        </v-btn-toggle>
                    </template>
                </v-toolbar>
            </template>
            <template #default="props">
                <Card
                    v-for="item in props.items"
                    :key="item.messageId"
                    :title="item.headline"
                    :img="item.imageUrl"
                    :source=" item.type"
                    :date="item.formattedDate"
                    :text="item.text"
                    :link="item.sourceUrl"
                    :categories="item.tags"
                    class="newsCard"
                />
            </template>
        </v-data-iterator>
        <template>
            <div class="text-center">
                <v-overlay :value="overlay">
                    <h1>Lade Feeds...</h1>
                    <v-progress-linear
                        indeterminate
                        color="white"
                    />
                </v-overlay>
            </div>
        </template>
        <v-alert
            prominent
            v-if="onboarding"
            type="info"
        >
            <v-row align="center">
                <v-col class="grow">
                    Keine Feeds vorhanden. Du kannst einen Feed unter <strong>meine Feeds</strong> anlegen
                </v-col>
                <v-col class="shrink">
                    <v-btn
                        to="/feeds"
                    >
                        Meine Feeds
                    </v-btn>
                </v-col>
            </v-row>
        </v-alert>
        <v-row class="justify-center align-center" v-if="onboarding">
            <v-spacer/>
            <v-col class="justify-center align-center">
                <v-card class="justify-center" flat width="500px">
                    <v-card-title class="justify-center">
                        Noch keine Nachrichten vorhanden
                    </v-card-title>
                    <v-img
                        src="https://i.imgur.com/LQUQZvA.png"
                        class="img"
                        :class="{ inverted: $vuetify.theme.dark }"
                    />
                </v-card>
            </v-col>
            <v-spacer/>
        </v-row>
    </div>
</template>

<script>
import Card from '../components/Card.vue';
import Api from '../api.js';
export default {
    name: 'Home',
    components: {
        Card
    },
    emits: { changed: null },
    data () {
        return {
            overlay: true,
            onboarding: false,
            search: '',
            filter: [],
            sortDesc: true,
            sortBy: 'utcTime',
            keys: [
                { text: 'Titel', value: 'Title' },
                { text: 'Quelle', value: 'Source' },
                { text: 'Datum', value: 'Date' }
            ],
            news: []
        };
    },
    computed: {
        filteredNews () {
            const filter = this.filter;
            if (null == this.filter || this.filter.length === 0) {
                return this.news;
            }
            return this.news.filter((newsItem) =>
                newsItem.tags.some(function (e) {
                    return filter.includes(e.name);
                })
            );
        }
    },
    async created () {
        await this.loadData();
        this.checkIfMessagesExist();
    },
    methods: {
        remove (id) {
            const index = this.filter.indexOf(id);
            this.filter.splice(index, 1);
            this.filter = [...this.filter];
        },
        changed () {
            this.$emit('changed', this.filter);
        },
        async loadData () {
            const news = await Api.messages();
            this.overlay = false;
            try {
                this.news = news.map((newsItem) => {
                    newsItem.date = new Date(newsItem.time);
                    newsItem.formattedDate = newsItem.date.toLocaleDateString('de-DE',
                        { hour: '2-digit', minute: '2-digit' });
                    newsItem.utcTime = newsItem.date.getTime();
                    return newsItem;
                });
            } catch (err) {
                console.log(err)
            }
        },
        checkIfMessagesExist () {
            if (this.news === [] || this.news.length === 0 || this.news === '') {
                this.onboarding = true
            } else {
                this.onboarding = false
            }
        }
    }
};
</script>
<style scoped>
.newsCard {
  margin: 50px;
}
.active {
  color: accent;
}
.inactive {
  color: secondary;
}
.img {
    opacity: 0.25;
}
.inverted {
    filter: invert(1);
}
</style>
