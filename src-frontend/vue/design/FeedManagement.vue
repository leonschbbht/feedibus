<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="feeds"
            sort-by="calories"
            class="elevation-1"
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
                                dark
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
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="editedItem.name"
                                                label="Feed Name"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="editedItem.type"
                                                label="Typ"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="editedItem.id"
                                                label="ID"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="editedItem.link"
                                                label="Link"
                                            />
                                        </v-col>
                                        <v-col
                                            cols="12"
                                            sm="6"
                                            md="4"
                                        >
                                            <v-text-field
                                                v-model="editedItem.categories"
                                                label="Kategorien"
                                            />
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer />
                                <v-btn
                                    color="warning darken-1"
                                    text
                                    @click="close"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-btn
                                    color="success darken-1"
                                    text
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
                                    color="warning darken-1"
                                    text
                                    @click="closeDelete"
                                >
                                    Abbrechen
                                </v-btn>
                                <v-btn
                                    color="error darken-1"
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
                    v-for="category in item.categories"
                    :key="category"
                >
                    {{ category }}
                </v-chip>
            </template>
            <template #[`item.actions`]="{ item }">
                <v-icon
                    small
                    class="mr-2"
                    @click="editItem(item)"
                >
                    mdi-pencil
                </v-icon>
                <v-icon
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
        </v-data-table>
    </div>
</template>
<script>
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Feedname',
                align: 'start',
                sortable: false,
                value: 'name'
            },
            { text: 'Feedtyp', value: 'type' },
            { text: 'Feed-ID', value: 'id' },
            { text: 'Link', value: 'link' },
            { text: 'Kategorien', value: 'categories' },
            { text: 'Aktionen', value: 'actions', sortable: false }

        ],
        feeds: [],
        editedIndex: -1,
        editedItem: {
            name: '',
            type: '',
            id: 0,
            link: '',
            categories: ''
        },
        defaultItem: {
            name: '',
            type: '',
            id: 0,
            link: '',
            categories: ''
        }
    }),

    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Feed hinzufügen' : 'Feed bearbeiten';
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

    created () {
        this.initialize();
    },

    methods: {
        initialize () {
            this.feeds = [
                { name: 'Tagesschau', type: 'RSS', id: '1', link: 'tagesschau.de', categories: ['Nachrichten', 'Medien'] },
                { name: 'Zeit', type: 'RSS', id: '2', link: 'zeit.de', categories: ['Nachrichten', 'Politik'] },
                { name: 'Alexibexi', type: 'YouTube', id: '3', link: 'youtube.com/alexibexi', categories: ['Technik', 'Unterhaltung'] }

            ];
        },

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

        deleteItemConfirm () {
            this.feeds.splice(this.editedIndex, 1);
            this.closeDelete();
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

        save () {
            if (this.editedIndex > -1) {
                Object.assign(this.feeds[this.editedIndex], this.editedItem);
            } else {
                this.feeds.push(this.editedItem);
            }
            this.close();
        }
    }
};
</script>
