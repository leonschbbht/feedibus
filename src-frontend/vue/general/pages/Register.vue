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
                            height="200px"
                            elevation="6"
                            color="accent"
                        >
                            <v-row
                                align="center"
                                justify="center"
                            >
                                <v-col
                                    class="text-center"
                                    cols="12"
                                >
                                    <h1 class="display-1 font-weight-thin mb-4">
                                        Wilkommen bei Feedibus!
                                    </h1>
                                    <h4 class="subheading">
                                        Im folgenden werden wir dich durch die Accounterstellung leiten
                                    </h4>
                                </v-col>
                            </v-row>
                            <v-rov
                                align="center"
                                justify="center"
                            >
                                <template>
                                    <div class="text-center">
                                        <v-dialog
                                            v-model="aboutFeedibus"
                                            width="500"
                                        >
                                            <template v-slot:activator="{ on, attrs }">
                                                <v-btn
                                                    dark
                                                    v-bind="attrs"
                                                    v-on="on"
                                                    color="primary"
                                                >
                                                    Was ist Feedibus?
                                                </v-btn>
                                            </template>

                                            <v-card>
                                                <v-card-title class="headline grey lighten-2">
                                                    Was ist Feedibus?
                                                </v-card-title>

                                                <v-card-text>
                                                    Feedibus ist eine Webanwendung mit der du Feeds von verschiedenen Seiten zentral abonnieren kannst. Somit musst du nicht mehr auf verschiedenen Seiten nach Neuerungen suchen sondern kannst mithilfe von Feedibus Nachrichten, Twitter, YoutTube und viele andere Seiten auf einen Blick erfassen
                                                </v-card-text>

                                                <v-divider></v-divider>

                                                <v-card-actions>
                                                    <v-spacer></v-spacer>
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
                            </v-rov>
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
                        <small>Dein Name wird nur zur Personalisierung verwendet</small>
                    </v-stepper-step>

                    <v-stepper-content step="2">
                        <v-card
                            class="mb-12"
                            height="200px"
                            elevation="6"
                            color="accent"
                        >
                            <v-container>
                                <v-card-title
                                >
                                    Bitte gib hier deinen Namen ein
                                </v-card-title>
                                <v-row>
                                    <v-spacer />
                                    <v-text-field
                                        v-model="name"
                                        label="Name"
                                        placeholder="Dein Name"
                                        solo
                                    />
                                    <v-spacer />
                                </v-row>
                            </v-container>
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
                        <small>Die E-Mail benötigst du bei der Anmeldung</small>
                    </v-stepper-step>

                    <v-stepper-content step="3">
                        <v-card
                            color="accent"
                            class="mb-12"
                            elevation="6"
                            height="200px"
                        >
                            <v-card-title>Deine E-Mail Adresse</v-card-title>
                            <v-row></v-row>
                            <v-row>
                                <v-spacer />
                                <v-text-field
                                    v-model="email"
                                    label="E-Mail"
                                    :rules="[rules.required, rules.email]"
                                    placeholder="E-Mail Adresse"
                                    solo
                                />
                                <v-spacer />
                            </v-row>
                        </v-card>
                        <v-btn
                            color="primary"
                            :disabled="true"
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
                        <small>Das Passwort wird nach modernen Sicherheitsstandards in unserer Datenbank abgelegt</small>
                    </v-stepper-step>
                    <v-stepper-content step="4">
                        <v-card
                            color="accent"
                            class="mb-12"
                            height="200px"
                            elevation="6"
                        ></v-card>
                        <v-btn
                            color="primary"
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
                        ></v-card>
                        <v-btn
                            color="success"
                        >
                            Account erstellen
                        </v-btn>
                        <v-btn
                            text
                            @click="e6=e6-1"
                        >
                            Zurück
                        </v-btn>
                    </v-stepper-content>
                </v-stepper>
            </v-card>
        </template>
        <!--
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Herzlich Willkommen!
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="name"
                    label="Name"
                />
                <v-text-field
                    v-model="email"
                    label="E-Mail"
                    :rules="[rules.required, rules.email]"
                />
                <v-text-field
                    v-model="password"
                    label="Passwort"
                    :rules="[rules.required]"

                    :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPw ? 'text' : 'password'"
                    @click:append="showPw = !showPw"
                />
                <v-text-field
                    v-model="passwordRepeat"
                    label="Passwort wiederholen"
                    :rules="[rules.required, rules.pwMatches]"
                    :append-icon="showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="showPw ? 'text' : 'password'"
                    @click:append="showPw = !showPw"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    :disabled="submitGeneralDisabled"
                    @click="submitGeneral"
                >
                    Registrieren
                </v-btn>
                <v-btn
                    color="warning"
                    text
                    @click="resetGeneral"
                >
                    Zurücksetzen
                </v-btn>
                <v-btn
                    color="info"
                    text
                    to="/"
                >
                    Zurück
                </v-btn>
            </v-card-actions>
        </v-card>
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
        -->
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
        submitGeneral
    },
    methods: {
        resetGeneral () {
            this.name = '';
            this.email = '';
            this.password = '';
            this.passwordRepeat = '';
        },
        async submitGeneral () {
            const response = await api.register(this.name, this.email, this.password);
            if (response) {
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
