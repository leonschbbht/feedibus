<template>
    <div>
        <v-data-iterator
            :items="filteredNews"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            :sort-by="sortBy.toLowerCase()"
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
                            :items="news.map((a) => a.categories).flat()"
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
                                :class="{primary: !sortDesc, secondary: sortDesc }"
                                :value="false"
                                
                            >
                                <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                                large
                                :class="{primary: sortDesc, secondary: !sortDesc }"
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
                    :key="item.title"
                    :title="item.title"
                    :img="item.img"
                    :source="item.source"
                    :date="item.date"
                    :text="item.text"
                    :link="item.link"
                    :categories="item.categories"
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
            sortBy: 'date',
            keys: [
                { text: 'Titel', value: 'Title' },
                { text: 'Quelle', value: 'Source' },
                { text: 'Datum', value: 'Date' }
            ],
            news: [
                {
                    title: 'Innenminister Caffier tritt zurück',
                    source: 'Tagesschau.de',
                    date: '1',
                    text:
            'Mecklenburg-Vorpommerns Innenminister Caffier ist zurückgetreten. Er war wegen eines umstrittenen Waffenkaufs unter Druck geraten. Sein Landtagsmandat will der CDU-Politiker behalten.',
                    link: 'https://www.tagesschau.de/inland/caffier-ruecktritt-103.html',
                    categories: ['Politik', 'Leitmedien']
                },
                {
                    title: 'Geht das jetzt immer so weiter?',
                    img:
            'https://img.zeit.de/wissen/gesundheit/2020-11/corona-politik-impfung-lockdown-kontaktverfolgung-pandemiekontrolle-strategien-bild/wide__820x461__desktop',
                    source: 'Zeit.de',
                    date: '2',
                    text:
            ' Die Politik wird die Corona-Regeln wohl bald noch einmal verschärfen. Doch was kommt danach? Drei mögliche Langzeitstrategien, die die Politik ergreifen könnte. Eine Analyse von Jakob Simmank, Florian Schumann und Philipp Daum',
                    link:
            'https://www.zeit.de/wissen/gesundheit/2020-11/corona-politik-impfung-lockdown-kontaktverfolgung-pandemiekontrolle-strategien',
                    categories: ['Corona', 'Leitmedien', 'Bla', 'Blubb', 'Kategorie1']
                },
                {
                    title: 'Elektroautokäufer sollen bis 2025 Zuschuss bekommen',
                    img:
            'https://media1.faz.net/ppmedia/aktuell/wirtschaft/4185919099/1.7056839/format_top1_breit/vw-produktion-in-zwickau.jpg',
                    source: 'faz.net',
                    date: '3',
                    text:
            'Längere Förderung für E-Autos, zahlreiche neue Ladestationen und mehr: Die Regierung plant eine Reihe von Maßnahmen, um die deutsche Autolandschaft zu transformieren. ',
                    link:
            'https://www.faz.net/aktuell/wirtschaft/elektroautokaeufer-sollen-bis-2025-einen-zuschuss-kriegen-17056821.html',
                    categories: ['Politik', 'Leitmedien', 'kategorie2']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!1',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '4',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!2',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '5',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!3',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '6',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!4',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '7',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!5',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '8',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!6',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '9',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!7',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '10',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!8',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '11',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!9',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '12',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!10',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '13',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!11',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '14',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                }
            ]
        };
    },
    computed: {
        filteredNews () {
            const filter = this.filter;
            if (null == this.filter || this.filter.length === 0) {
                return this.news;
            }
            return this.news.filter((newsItem) =>
                newsItem.categories.some(function (e) {
                    console.log(e)
                    return filter.includes(e);
                })
            );
        },
        maxPages () {
            return Math.ceil(this.filteredNews.length / this.itemsPerPage);
        }
    },
    methods: {
        remove (id) {
            const index = this.filter.indexOf(id);
            this.filter.splice(index, 1);
            this.filter = [...this.filter];
        },
        changed () {
            this.$emit('changed', this.filter)
        }
    }
};
</script>
<style scoped>
.newsCard {
  margin: 50px;
}
.active{
color: accent;
}
.inactive{
    color:secondary;
}
</style>
