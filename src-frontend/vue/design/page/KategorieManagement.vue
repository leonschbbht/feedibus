<template>
    <div>
        <v-data-table
            :headers="headers"
            :items="kategorieElemente"
            :items-per-page="5"
            class="elevation-1"
        >
        </v-data-table>
        <v-spacer></v-spacer>
        <template>
            <v-row justify="center">
                <v-dialog
                    v-model="dialog"
                    persistent
                    max-width="600px"
                >
                    <template v-slot:activator="{ on, attrs }">
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
                                    <v-col
                                    >
                                        <v-text-field
                                            v-model="name"
                                            label="Bezeichnung*"
                                            hint="Bezeichnung der neuen Kategorie"
                                            required
                                        ></v-text-field>
                                    </v-col>
                                    <v-col>
                                        <v-text-field
                                            v-model="color"
                                            label="Farbe"
                                            hint="Anzeigefarbe der neuen Kategorie"
                                        >
                                        </v-text-field>
                                    </v-col>
                                </v-row>
                            </v-container>
                            <small>*erforderlich</small>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
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
        </template>
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
            }
        ],
        kategorieElemente: [],
        dialog: false,
        name: '',
        color: ''
    }),
    created () {
        this.loadData();
    },
    methods: {
        async submit () {
            const response = await Api.createTag(this.name, this.color);
            if (response) {
                console.log(response);
            } else {
                this.dialog = false;
            }
            await this.loadData();
        },

        async loadData () {
            const response = await Api.tags();
            this.kategorieElemente = response;
        }
    }
}
</script>
