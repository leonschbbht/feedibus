<template>
    <div>
        <v-data-iterator
            :items="filteredNews"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            :sort-by="sortBy"
            :sort-desc="sortDesc"
            hide-default-footer
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
                    :source="item.type"
                    :date="item.formattedDate"
                    :text="item.text"
                    :link="item.sourceUrl"
                    :categories="item.tags.map((a) => a.name).flat()"
                    class="newsCard"
                />
            </template>
            <template #footer>
                <v-pagination
                    v-model="page"
                    color="secondary"
                    :length="maxPages"
                    :total-visible="10"
                />
            </template>
        </v-data-iterator>
    </div>
</template>

<script>
import Card from './components/Card.vue';
import Api from './api.js';
export default {
    name: 'Home',
    components: {
        Card
    },
    emits: { changed: null },
    data () {
        return {
            search: '',
            filter: [],
            sortDesc: true,
            page: 1,
            itemsPerPage: 10,
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
        },
        maxPages () {
            return Math.ceil(this.filteredNews.length / this.itemsPerPage);
        }
    },
    created () {
        this.loadData();
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
            this.news = news.map((newsItem) => {
                newsItem.date = new Date(newsItem.time);
                newsItem.formattedDate = newsItem.date.toLocaleDateString('de-DE', { hour: '2-digit', minute: '2-digit' });
                newsItem.utcTime = newsItem.date.getTime();
                return newsItem;
            });
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
</style>
