<template>
    <div>
        <v-toolbar
            flat
            class="secondary"
        >
            <v-toolbar-title class="white--text">
                Kategorien verwalten
            </v-toolbar-title>
            <v-row justify="center">
                <v-dialog
                    v-model="dialog"
                    persistent
                    max-width="600px"
                >
                    <template #activator="{ on, attrs }">
                        <v-btn
                            color="primary"
                            dark
                            v-bind="attrs"
                            v-on="on"
                        >
                            Kategorie hinzufügen...
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Kategorie hinzufügen</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col>
                                        <v-text-field
                                            v-model="name"
                                            label="Bezeichnung*"
                                            hint="Bezeichnung der neuen Kategorie"
                                            required
                                        />
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                            v-model="color"
                                            label="Farbe"
                                            hint="Anzeigefarbe der neuen Kategorie"
                                        />
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*erforderlich</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn
                                color="warning"
                                text
                                @click="dialog = false"
                            >
                                Abbrechen
                            </v-btn>
                            <v-btn
                                color="success"
                                text
                                @click="submit()"
                            >
                                Speichern
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-row>
            <v-dialog
                v-model="dialogDelete"
                max-width="500px"
            >
                <v-card>
                    <v-card-title class="headline">
                        Diese Kategorie löschen?
                    </v-card-title>
                    <v-card-actions>
                        <v-spacer />
                        <v-btn
                            color="primary"
                            text
                            @click="dialogDelete=false"
                        >
                            Abbrechen
                        </v-btn>
                        <v-btn
                            color="error"
                            text
                            @click="confirmDelete()"
                        >
                            Löschen
                        </v-btn>
                        <v-spacer />
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-toolbar>
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
        <v-card
            class="mx-auto card justify-center"
            :max-width="$vuetify.breakpoint.mobile ? '97%' : '60%'"
        >
            <v-data-table
                :headers="headers"
                :items="kategorieElemente"
            >
                <template #[`item.name`]="{ item }">
                    <v-chip
                        light
                    >
                        {{ item.name }}
                    </v-chip>
                </template>
                <template #[`item.color`]="{ item }">
                    <v-chip
                        v-if="item.color !== ''"
                        light
                    >
                        {{ item.color }}
                    </v-chip>
                </template>
                <template #[`item.actions`]="{ item }">
                    <v-btn
                        icon
                    >
                        <v-icon
                            @click="deleteKategorie(item.id)"
                        >
                            mdi-delete
                        </v-icon>
                    </v-btn>
                </template>
            </v-data-table>
        </v-card>
        <div class="text-center">
            <v-bottom-sheet v-model="sheet">
                <v-sheet
                    class="text-center"
                    height="200px"
                >
                    <h3 class="warning">
                        Hilfe zu Kategorien
                    </h3>
                    <div class="py-3">
                        Auf dieser Seite kannst du Kategorien hinzufügen um die von dir abonnierten Feeds zu sortieren
                    </div>
                    <div class="py-2">
                        Klicke einfach auf <strong>Kategorie hinzufügen</strong> und vergieb einen passenden Namen
                    </div>
                    <v-btn
                        color="warning"
                        dark
                        class="pa-3"
                        @click="dialog = true"
                    >
                        Kategorie hinzufügen...
                    </v-btn>
                </v-sheet>
            </v-bottom-sheet>
        </div>
    </div>
</template>
<script>
import Api from '../api'

export default {
    name: 'Kategorie',
    components: {
    },
    data: () => ({
        headers: [
            {
                text: 'Kategorie',
                align: 'start',
                value: 'name'
            },
            {
                text: 'Farbe',
                value: 'color'
            },
            {
                text: 'Aktionen',
                value: 'actions'
            }
        ],
        kategorieElemente: [],
        name: '',
        color: '',
        dialog: false,
        dialogDelete: false,
        selectedToDeleteID: -1,
        sheet: false,
        snackbarData: {
            enabled: false,
            text: '',
            color: ''
        }
    }),
    async created () {
        await this.loadData();
        await this.checkIfCategoriesExist();
    },
    methods: {
        async submit () {
            const response = await Api.createTag(this.name, this.color);
            if (response) {
                console.log(response);
            } else {
                this.dialog = false;
                this.snackbarData.enabled = true;
                this.snackbarData.text = 'Die Kategorie wurde hinzugefügt';
                this.snackbarData.color = 'warning';
            }
            this.name = '';
            this.color = '';
            await this.loadData();
        },
        async deleteKategorie (itemIndex) {
            this.selectedToDeleteID = itemIndex;
            this.dialogDelete = true;
        },
        async confirmDelete () {
            const response = await Api.deleteTag(this.selectedToDeleteID);
            if (response) {
                console.log(response);
            } else {
                this.snackbarData.enabled = true;
                this.snackbarData.text = 'Die Kategorie wurde gelöscht';
                this.snackbarData.color = 'warning';
                this.dialogDelete = false
            }
            await this.loadData();
            this.selectedToDeleteID = -1
        },
        async loadData () {
            this.kategorieElemente = await Api.tags();
        },
        checkIfCategoriesExist () {
            if (this.kategorieElemente.length === 0) {
                this.sheet = true;
            } else {
                this.sheet = false
            }
        }
    }
}
</script>
