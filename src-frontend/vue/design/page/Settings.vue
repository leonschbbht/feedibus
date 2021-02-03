<template>
    <div>
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Benutzer Einstellungen
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="userDataNew.name"
                    :counter="10"
                    label="Name"
                />
                <v-text-field
                    v-model="userDataNew.email"
                    label="E-Mail"
                    :rules="[rules.required, rules.email]"
                />
                <v-text-field
                    v-model="userDataNew.emailRepeat"
                    label="E-Mail wiederholen"
                    :rules="[rules.required, rules.email, rules.emailMatches]"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    text
                    :disabled="submitGeneralDisabled"
                    @click="submitGeneral"
                >
                    Änderungen absenden
                </v-btn>
                <v-btn
                    color="warning"
                    text
                    @click="resetGeneral"
                >
                    Änderungen verwerfen
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Passwort
            </v-card-title>
            <v-card-text>
                <v-text-field
                    v-model="passwordData.password"
                    label="Neues Passwort"
                    :rules="[rules.required]"

                    :append-icon="passwordData.showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordData.showPw ? 'text' : 'password'"
                    @click:append="passwordData.showPw = !passwordData.showPw"
                />
                <v-text-field
                    v-model="passwordData.passwordRepeat"
                    label="Neues Passwort wiederholen"
                    :rules="[rules.required, rules.pwMatches]"

                    :append-icon="passwordData.showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordData.showPw ? 'text' : 'password'"
                    @click:append="passwordData.showPw = !passwordData.showPw"
                />
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    text
                    :disabled="submitPasswordDisabled"
                    @click="submitPassword"
                >
                    Änderungen absenden
                </v-btn>
            </v-card-actions>
        </v-card>
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Sonstige Einstellungen
            </v-card-title>
            <v-card-text>
                <v-switch
                    v-model="$vuetify.theme.dark"
                    hint="Der Dunkle-Modus wird nach dem ausloggen zurückgesetzt"
                    inset
                    label="Dunkler Modus"
                    persistent-hint
                    @click="writeDarkModeCooke($vuetify.theme.dark)"
                />
            </v-card-text>
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
    </div>
</template>
<script>
import Api from '../api.js'

export default {
    name: 'Settings',
    components: {
    },
    data () {
        return {
            userData: { name: 'Jan', email: 'jan@huemmelinkcloud.de' },
            userDataNew: { name: '', email: '', emailRepeat: '' },
            passwordData: {
                password: '',
                passwordRepeat: '',
                showPw: false
            },
            snackbarData: {
                enabled: false,
                text: '',
                color: ''
            },

            rules: {
                required: value => !!value || 'Pflichtfeld',
                email: value => {
                    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                    return pattern.test(value) || 'Ungültige E-Mail.'
                },
                pwMatches: value => {
                    return this.passwordData.password === this.passwordData.passwordRepeat || 'Passwort stimmt nicht überein.'
                },
                emailMatches: value => {
                    return this.userDataNew.email === this.userDataNew.emailRepeat || 'E-Mail stimmt nicht überein.'
                }
            }
        }
    },
    computed: {
        submitGeneralDisabled () {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            let disabled = false;
            disabled = !pattern.test(this.userDataNew.email);
            disabled = disabled || this.userDataNew.email !== this.userDataNew.emailRepeat;
            disabled = disabled || !this.userDataNew.name;
            return disabled;
        },
        submitPasswordDisabled () {
            return this.passwordData.password !== this.passwordData.passwordRepeat || !this.passwordData.password;
        }
    },
    async created () {
        await this.getUserData();
        this.resetGeneral();
    },
    methods: {
        resetGeneral () {
            this.userDataNew.name = this.userData.name;
            this.userDataNew.email = this.userData.email;
            this.userDataNew.emailRepeat = this.userData.email;
        },
        submitGeneral () {
            this.snackbarData.text = 'Daten übernommen!'
            this.snackbarData.color = 'success'
            this.snackbarData.enabled = true;
        },
        submitPassword () {
            this.snackbarData.text = 'Daten übernommen!'
            this.snackbarData.color = 'success'
            this.snackbarData.enabled = true;
        },
        writeDarkModeCooke (isDarkmodeActive) {
            document.cookie = 'darkmodeActive=' + isDarkmodeActive + '; path=/';
        },
        async getUserData () {
            const response = await Api.getUser();
            this.userData = response.data.user;
        }
    }
}
</script>
<style scoped>
.card{
  margin: 50px;
}
</style>
