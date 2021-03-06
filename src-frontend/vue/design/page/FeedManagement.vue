<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="feeds"
            :items-per-page.sync="itemsPerPage"
            :page="page"
            class="elevation-1"
            hide-default-footer
            light
        >
            <template #top>
                <v-toolbar
                    flat
                    class="secondary"
                >
                    <v-toolbar-title class="white--text">
                        Meine Feeds
                    </v-toolbar-title>
                    <v-spacer />
                    <v-dialog
                        v-model="dialog"
                        max-width="500px"
                    >
                        <template #activator="{ on, attrs }">
                            <v-btn
                                color="primary"
                                class="mb-2"
                                v-bind="attrs"
                                v-on="on"
                            >
                                Neuer Feed
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="7"
                                        >
                                            <v-text-field
                                                v-model="editedItem.name"
                                                label="Feed Name"
                                                :rules="[rules.required]"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <v-select
                                                v-model="editedItem.type"
                                                :items="types"
                                                label="Typ"
                                                :rules="[rules.required]"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="7"
                                        >
                                            <v-text-field
                                                v-model="editedItem.url"
                                                label="Link"
                                                :rules="[rules.required]"
                                                color="dynamic"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="7"
                                        >
                                            <v-select
                                                v-model="editedItem.categories"
                                                :items="categories"
                                                multiple
                                                chips
                                                label="Kategorien"
                                            >
                                                <template #selection="{ item, index }">
                                                    <v-chip v-if="index === 0">
                                                        <span>{{ item }}</span>
                                                    </v-chip>
                                                    <span
                                                        v-if="index === 1"
                                                        class="caption"
                                                    >
                                                        (+{{ editedItem.categories.length-1 }} andere)
                                                    </span>
                                                </template>
                                            </v-select>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer />
                                <v-btn
                                    color="warning"
                                    text
                                    @click="close"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-btn
                                    color="success"
                                    text
                                    :disabled="saveDisabled"
                                    @click="save"
                                >
                                    Speichern
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <v-dialog
                        v-model="dialogDelete"
                        max-width="500px"
                    >
                        <v-card>
                            <v-card-title
                                class="headline"
                            >
                                Willst du den Feed wirklich entfernen?
                            </v-card-title>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn
                                    color="warning"
                                    text
                                    @click="closeDelete"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-btn
                                    color="error"
                                    text
                                    @click="deleteItemConfirm"
                                >
                                    Löschen
                                </v-btn>
                                <v-spacer />
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template #[`item.categories`]="{ item }">
                <v-chip
                    v-for="category in item.tags"
                    :key="category"
                    :color="item.color"
                >
                    {{ category }}
                </v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-icon
                    large
                    small
                    @click="deleteItem(item)"
                >
                    mdi-delete
                </v-icon>
            </template>
            <template #no-data>
                <v-btn
                    color="primary"
                    @click="initialize"
                >
                    Reset
                </v-btn>
            </template>
            <template #footer>
                <v-pagination
                    v-model="page"
                    color="secondary"
                    :length="maxPages"
                    :total-visible="10"
                />
            </template>
        </v-data-table>
        <v-snackbar
            v-model="snackbarData.enabled"
            text
            :color="snackbarData.color"
        >
            {{ snackbarData.text }}

            <template #action="{ attrs }">
                <v-btn
                    :color="snackbarData.color"
                    outlined
                    v-bind="attrs"
                    @click="snackbarData.enabled = false"
                >
                    Schließen
                </v-btn>
            </template>
        </v-snackbar>
        <div class="text-center">
            <v-bottom-sheet v-model="sheet">
                <v-sheet
                    class="text-center"
                    height="200px"
                >
                    <h3 class="warning">
                        Hilfe zu Feeds
                    </h3>
                    <div class="py-3">
                        Auf dieser Seite kannst du einstellen, welchen Feeds du folgen möchtest
                    </div>
                    <div class="py-2">
                        Klicke einfach auf <strong>Feed hinzufügen</strong> und vergebe einen passenden Namen
                    </div>
                    <v-btn
                        color="warning"
                        class="pa-3"
                        @click="dialog = true"
                    >
                        Feed hinzufügen...
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
        <template>
            <div class="text-center">
                <v-overlay :value="overlay">
                    <h1>Lade Feeds...</h1>
                    <v-progress-linear
                        indeterminate
                        color="white"
                    ></v-progress-linear>
                </v-overlay>
            </div>
        </template>
    </div>
</template>
<script>
import Api from '../api';

export default {
    data: () => ({
        overlay: true,
        page: 1,
        itemsPerPage: 5,
        dialog: false,
        dialogDelete: false,
        types: [
            'rss',
            'twitter',
            'youtube',
            'facebook'
        ],
        categories: [],
        categoriesJSON: [],
        categoriesApiResponse: [],
        headers: [
            {
                text: 'Feedname',
                align: 'start',
                sortable: false,
                value: 'name'
            },
            { text: 'Feedtyp', value: 'type' },
            { text: 'Adresse', value: 'url' },
            { text: 'Kategorien', value: 'categories' },
            { text: 'Aktionen', value: 'actions', sortable: false }

        ],
        rules: {
            required: value => !!value || 'Pflichtfeld'
        },
        feeds: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            type: '',
            id: 0,
            url: '',
            categories: []
        },
        defaultItem: {
            name: '',
            type: '',
            id: 0,
            url: '',
            categories: []
        },
        snackbarData: {
            enabled: false,
            text: '',
            color: ''
        },
        sheet: false
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Feed hinzufügen' : 'Feed bearbeiten';
        },
        maxPages () {
            return Math.ceil(this.feeds.length / this.itemsPerPage);
        },
        saveDisabled () {
            return !(this.editedItem.name && this.editedItem.type && this.editedItem.url)
        }

    },
    watch: {
        dialog (val) {
            val || this.close();
        },
        dialogDelete (val) {
            val || this.closeDelete();
        }
    },

    async created () {
        await this.loadData();
        await this.checkIfCategoriesExist();
    },

    methods: {

        editItem (item) {
            this.editedIndex = this.feeds.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        deleteItem (item) {
            this.editedIndex = this.feeds.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialogDelete = true;
        },

        async deleteItemConfirm () {
            this.feeds.splice(this.editedIndex, 1);
            await Api.deleteFeed(this.editedItem.id);
            this.closeDelete();
            this.snackbarData.enabled = true
            this.snackbarData.color = 'warning'
            this.snackbarData.text = 'Feed wurde gelöscht'
        },

        close () {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        closeDelete () {
            this.dialogDelete = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        async save () {
            const ids = [];
            for (let i = 0; i < this.categoriesJSON.length; i++) {
                for (let j = 0; j < this.editedItem.categories.length; j++) {
                    if (this.categoriesJSON[i].name === this.editedItem.categories[j]) {
                        ids.push(this.categoriesJSON[i].id);
                    }
                }
            }
            await Api.createFeed(this.editedItem.type, this.editedItem.url, this.editedItem.name, ids);
            await this.loadData();
            this.snackbarData.enabled = true
            this.snackbarData.color = 'warning'
            this.snackbarData.text = 'Feed wurde hinzugefügt'
            this.sheet = false;
            this.close();
        },
        async loadData () {
            await this.convertFeeds();
            const response = await Api.tags();
            this.categoriesJSON = response;
            response.forEach(category => {
                const name = category.name;
                this.categories.push(name);
            });
            this.overlay = false;
        },
        async convertFeeds () {
            const feeds = await Api.feeds();
            if (feeds !== '') {
                for (let index = 0; index < feeds.length; index++) {
                    const nameArray = [];
                    for (let i = 0; i < feeds[index].tags.length; i++) {
                        nameArray.push(feeds[index].tags[i].name);
                    }
                    feeds[index].tags = nameArray;
                }
                this.feeds = feeds;
            } else {
                this.feeds = [];
            }
        },
        checkIfCategoriesExist () {
            if (this.feeds.length === 0) {
                this.sheet = true;
            } else {
                this.sheet = false
            }
        }
    }
};
</script>
<style>
table.v-table {
  max-width: none;
}
</style>
