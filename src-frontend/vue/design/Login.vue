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
                    v-model="passwordData.password"
                    label="Passwort"
                    :rules="[rules.required]"

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
                    Login
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
            email: '',
            passwordData: {
                password: '',
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
                }
            }
        }
    },
    methods: {
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
