<template>
    <div>
        <v-card
            class="mx-auto card"
            :max-width="$vuetify.breakpoint.mobile ? '100%' : '60%'"
        >
            <v-card-title class="white--text secondary">
                Login
            </v-card-title>
            <v-card-text>
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
            </v-card-text>
            <v-card-actions>
                <v-btn
                    color="success"
                    @click="submitGeneral"
                >
                    Login
                </v-btn>
                <v-btn
                    color="info"
                    to="/register"
                >
                    Registrieren
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
import api from '../api';

export default {
    name: 'Register',
    data () {
        return {
            email: '',
            password: '',
            showPw: false,
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
                }
            }
        }
    },
    methods: {
        async submitGeneral () {
            const response = await api.login(this.email, this.password);
            if (response) {
                this.snackbarData.text = response;
                this.snackbarData.color = 'error';
                this.snackbarData.enabled = true;
            } else {
                window.location = '/home.html';
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
