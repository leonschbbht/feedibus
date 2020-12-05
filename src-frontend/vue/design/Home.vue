<template>
    <div>
        <v-data-iterator
            :items="filteredNews"
            :pagination.sync="pagination"
            :sort-by="sortBy.toLowerCase()"
            :sort-desc="sortDesc"
        >
            <template #header>
                <v-toolbar
                    dark
                    color="secondary"
                    class="toolBar"
                >
                    <template>
                        <v-spacer />
                        <v-select
                            v-model="filter"
                            flat
                            chips
                            multiple
                            solo-inverted
                            hide-details
                            :items="news.map((a) => a.categories).flat()"
                            prepend-inner-icon="mdi-magnify"
                            label="Filtern nach"
                        />
                        <v-spacer />
                        <v-btn-toggle
                            v-model="sortDesc"
                            mandatory
                        >
                            <v-btn
                                large
                                depressed
                                color="accent"
                                :value="false"
                            >
                                <v-icon>mdi-arrow-up</v-icon>
                            </v-btn>
                            <v-btn
                                large
                                depressed
                                color="accent"
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
    data () {
        return {
            pagination: {
                rowsPerPage: 4
            },
            search: '',
            filter: [],
            sortDesc: true,
            page: 1,
            itemsPerPage: 4,
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
                    date: '17.11.2020 17:51',
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
                    date: '17.11.2020 15:03',
                    text:
            ' Die Politik wird die Corona-Regeln wohl bald noch einmal verschärfen. Doch was kommt danach? Drei mögliche Langzeitstrategien, die die Politik ergreifen könnte. Eine Analyse von Jakob Simmank, Florian Schumann und Philipp Daum',
                    link:
            'https://www.zeit.de/wissen/gesundheit/2020-11/corona-politik-impfung-lockdown-kontaktverfolgung-pandemiekontrolle-strategien',
                    categories: ['Corona', 'Leitmedien']
                },
                {
                    title: 'Elektroautokäufer sollen bis 2025 Zuschuss bekommen',
                    img:
            'https://media1.faz.net/ppmedia/aktuell/wirtschaft/4185919099/1.7056839/format_top1_breit/vw-produktion-in-zwickau.jpg',
                    source: 'faz.net',
                    date: '17.11.2020 15:18',
                    text:
            'Längere Förderung für E-Autos, zahlreiche neue Ladestationen und mehr: Die Regierung plant eine Reihe von Maßnahmen, um die deutsche Autolandschaft zu transformieren. ',
                    link:
            'https://www.faz.net/aktuell/wirtschaft/elektroautokaeufer-sollen-bis-2025-einen-zuschuss-kriegen-17056821.html',
                    categories: ['Politik', 'Leitmedien']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!1',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!2',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!3',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!4',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!5',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!6',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!7',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!8',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!9',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!10',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
                    text:
            'Das ist er also: Der M1 von Apple. Der Anfang der Zukunft von Computern! Was uns wohl bald erwartet habe ich an all den drei neuen Geräte ausprobiert. Was ist das Ergebnis? Das verrate ich euch in diesem Video! #AppleM1',
                    link: 'https://www.youtube.com/watch?v=xSRI2_z-QwE',
                    categories: ['Unterhaltung']
                },
                {
                    title: 'Einfach Uff: ALLE Apple M1 ausprobiert!11',
                    img: 'http://i3.ytimg.com/vi/xSRI2_z-QwE/maxresdefault.jpg',
                    source: 'youtube / alexibexi',
                    date: '17.11.2020',
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
        }
    }
};
</script>
<style scoped>
.newsCard {
  margin: 50px;
}
</style>
