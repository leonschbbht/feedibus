<template>
    <div>
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Herzlich Willkommen!
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
                <v-text-field
                    v-model="passwordData.password"
                    label="Passwort"
                    :rules="[rules.required]"

                    :append-icon="passwordData.showPw ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="passwordData.showPw ? 'text' : 'password'"
                    @click:append="passwordData.showPw = !passwordData.showPw"
                />
                <v-text-field
                    v-model="passwordData.passwordRepeat"
                    label="Passwort wiederholen"
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
    </div>
</template>
<script>
export default {
    name: 'Register',
    components: {
    },
    data () {
        return {
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
        submitGeneralDisabled: function () {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            let disabled = false;
            disabled = !pattern.test(this.userDataNew.email);
            disabled = disabled || this.userDataNew.email !== this.userDataNew.emailRepeat;
            disabled = disabled || !this.userDataNew.name;
            disabled = disabled || this.passwordData.password !== this.passwordData.passwordRepeat || !this.passwordData.password;
            return disabled;
        }
    },
    methods: {
        resetGeneral () {
            this.userDataNew.name = '';
            this.userDataNew.email = '';
            this.userDataNew.emailRepeat = '';
            this.passwordData.password = '';
            this.passwordData.passwordRepeat = '';
        },
        submitGeneral () {
            this.snackbarData.text = 'Daten übernommen!'
            this.snackbarData.color = 'success'
            this.snackbarData.enabled = true;
        }
    }
}
</script>
<style scoped>
.card{
  margin: 50px;
}
</style>
