<template>
    <div>
        <template>
            <v-card
                class="mx-auto card"
                :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
            >
                <v-stepper
                    v-model="e6"
                    vertical
                >
                    <v-stepper-step
                        :complete="e6 > 1"
                        step="1"
                    >
                        Allgemeine Hinweise
                        <small>Willkommen bei Feedibus</small>
                    </v-stepper-step>

                    <v-stepper-content step="1">
                        <v-card
                            class="mb-12"
                            height="350px"
                            elevation="6"
                            color="accent"
                        >
                            <v-card-title class="white--text primary">
                                Wilkommen bei Feedibus!
                            </v-card-title>
                            <v-row
                                align="center"
                                justify="center"
                            >
                                <h3 class="ma-8">
                                    Im Folgenden werden wir dich durch die Accounterstellung leiten
                                </h3>
                            </v-row>
                            <v-row
                                align="center"
                                justify="center"
                            >
                                <template>
                                    <div class="text-center">
                                        <v-dialog
                                            v-model="aboutFeedibus"
                                            width="500"
                                        >
                                            <template #activator="{ on, attrs }">
                                                <v-btn
                                                    dark
                                                    v-bind="attrs"
                                                    color="primary"
                                                    v-on="on"
                                                >
                                                    Was ist Feedibus?
                                                </v-btn>
                                            </template>

                                            <v-card>
                                                <v-card-title class="white--text primary">
                                                    Was ist Feedibus?
                                                </v-card-title>

                                                <v-card-text>
                                                    Feedibus ist eine Webanwendung mit der du Feeds von verschiedenen Seiten zentral abonnieren kannst. Somit musst du nicht mehr auf verschiedenen Seiten nach Neuerungen suchen sondern kannst mithilfe von Feedibus Nachrichten, Twitter, YoutTube und viele andere Seiten auf einen Blick erfassen
                                                </v-card-text>

                                                <v-divider />

                                                <v-card-actions>
                                                    <v-spacer />
                                                    <v-btn
                                                        color="primary"
                                                        text
                                                        @click="aboutFeedibus = false"
                                                    >
                                                        Schließen
                                                    </v-btn>
                                                </v-card-actions>
                                            </v-card>
                                        </v-dialog>
                                    </div>
                                </template>
                            </v-row>
                        </v-card>
                        <v-btn
                            color="primary"
                            @click="e6 = 2"
                        >
                            Weiter
                        </v-btn>
                        <v-btn
                            text
                            to="/"
                        >
                            Abbrechen
                        </v-btn>
                    </v-stepper-content>

                    <v-stepper-step
                        :complete="e6 > 2"
                        step="2"
                    >
                        Dein Name
                    </v-stepper-step>

                    <v-stepper-content step="2">
                        <v-card
                            height="200px"
                            elevation="6"
                            color="accent"
                            class="mb-12"
                        >
                            <v-card-title
                                class="white--text primary"
                            >
                                Bitte gib hier deinen Namen ein
                            </v-card-title>
                            <v-row
                                align="center"
                                justify="center"
                            >
                                <v-spacer />
                                <v-text-field
                                    v-model="name"
                                    label="Dein Name"
                                    placeholder="optional"
                                    class="ma-12"
                                />
                                <v-spacer />
                            </v-row>
                        </v-card>
                        <v-btn
                            color="primary"
                            @click="e6 = 3"
                        >
                            Weiter
                        </v-btn>
                        <v-btn
                            text
                            @click="e6 = e6-1"
                        >
                            Zurück
                        </v-btn>
                    </v-stepper-content>

                    <v-stepper-step
                        :complete="e6 > 3"
                        step="3"
                    >
                        Deine E-Mail Adresse
                    </v-stepper-step>

                    <v-stepper-content step="3">
                        <v-card
                            color="accent"
                            class="mb-12"
                            elevation="6"
                            height="200px"
                        >
                            <v-card-title
                                class="white--text primary"
                                :class="{info: submitGeneralDisabledEmail}"
                            >
                                Deine E-Mail Adresse
                            </v-card-title>
                            <v-row />
                            <v-row>
                                <v-spacer />
                                <v-text-field
                                    v-model="email"
                                    label="E-Mail"
                                    :rules="[rules.required, rules.email]"
                                    placeholder="E-Mail Adresse"
                                    class="ma-12"
                                />
                                <v-spacer />
                            </v-row>
                        </v-card>
                        <v-btn
                            color="primary"
                            :disabled="submitGeneralDisabledEmail"
                            @click="e6 = 4"
                        >
                            Weiter
                        </v-btn>
                        <v-btn
                            text
                            @click="e6=e6-1"
                        >
                            Zurück
                        </v-btn>
                    </v-stepper-content>

                    <v-stepper-step
                        step="4"
                        :complete="e6 > 4"
                    >
                        Passwort vergeben
                    </v-stepper-step>
                    <v-stepper-content step="4">
                        <v-card
                            color="accent"
                            class="mb-12"
                            elevation="6"
                        >
                            <v-card-title
                                class="white--text primary"
                                :class="{info: submitGeneralDisabledPassword}"
                            >
                                Passwort vergeben
                            </v-card-title>
                            <v-card-text>
                                <v-row>
                                    <v-spacer />
                                    <v-text-field
                                        v-model="password"
                                        label="Passwort"
                                        :rules="[rules.required]"
                                        placeholder="Dein Passwort"
                                        :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                                        :type="showPw ? 'text' : 'password'"
                                        @click:append="showPw = !showPw"
                                    />
                                    <v-spacer />
                                </v-row>
                                <v-row>
                                    <v-spacer />
                                    <v-text-field
                                        v-model="passwordRepeat"
                                        label="Passwort wiederholen"
                                        :rules="[rules.required, rules.pwMatches]"
                                        :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                                        :type="showPw ? 'text' : 'password'"
                                        @click:append="showPw = !showPw"
                                    />
                                    <v-spacer />
                                </v-row>
                            </v-card-text>
                        </v-card>
                        <v-btn
                            color="primary"
                            :disabled="submitGeneralDisabledPassword"
                            @click="e6 = e6+1"
                        >
                            Weiter
                        </v-btn>
                        <v-btn
                            text
                            @click="e6=e6-1"
                        >
                            Zurück
                        </v-btn>
                    </v-stepper-content>
                    <v-stepper-step step="5">
                        Account erstellen
                    </v-stepper-step>
                    <v-stepper-content step="5">
                        <v-card
                            color="accent"
                            class="mb-12"
                            height="200px"
                            elevation="6"
                        >
                            <v-card-title class="white--text primary">
                                Wir haben alles was wir wissen müssen
                            </v-card-title>
                        </v-card>
                        <v-btn
                            color="primary"
                            @click="submitGeneral()"
                        >
                            Account erstellen
                        </v-btn>
                        <v-btn
                            text
                            @click="e6--"
                        >
                            Zurück
                        </v-btn>
                    </v-stepper-content>
                </v-stepper>
            </v-card>
        </template>
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
    </div>
</template>
<script>
import api from '../api';

export default {
    name: 'Register',
    data () {
        return {
            name: '',
            email: '',
            password: '',
            passwordRepeat: '',
            showPw: false,
            snackbarData: {
                enabled: false,
                text: '',
                color: ''
            },
            e6: 1,
            aboutFeedibus: false,

            rules: {
                required: value => !!value || 'Pflichtfeld',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Ungültige E-Mail.'
                },
                pwMatches: () => {
                    return this.password === this.passwordRepeat || 'Passwort stimmt nicht überein.'
                }
            }
        }
    },
    computed: {
        submitGeneralDisabled: function () {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return !pattern.test(this.email) ||
                !this.name ||
                this.password !== this.passwordRepeat ||
                !this.password;
        },
        submitGeneralDisabledEmail: function () {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            return !pattern.test(this.email)
        },
        submitGeneralDisabledPassword: function () {
            return this.password !== this.passwordRepeat || !this.password;
        }
    },
    methods: {
        async submitGeneral () {
            const response = await api.register(this.name, this.email, this.password);
            if (response !== '') {
                this.snackbarData.text = response
                this.snackbarData.color = 'error'
                this.snackbarData.enabled = true;
            } else {
                await this.$router.push('/');
            }
        }
    }
}
</script>

<style scoped>
.card{
  margin: 50px;
}
</style>
