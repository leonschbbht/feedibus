import Axios from 'axios';

export default class api {
    /**
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @return {Promise<string>}
     */
    static async register (name, email, password) {
        const data = {
            name: name,
            email: email,
            password: password
        };
        try {
            const response = await Axios.post('/register', data);
            if (response.status === 201) {
                return '';
            } else if (typeof response.data === 'string') {
                return response.data;
            }
        } catch (error) {
            return 'Registrierung fehlgeschlagen. Existiert der Benutzer bereits?'
        }
    }

    /**
     * @param {string} email
     * @param {string} password
     * @return {Promise<string>}
     */
    static async login (email, password) {
        const data = {
            email: email,
            password: password
        };
        try {
            const response = await Axios.post('/login', data);
            if (response.status === 200) {
                return '';
            } else if (typeof response.data === 'string') {
                return response.data;
            }
            return 'Error'
        } catch (err) {
            return 'Der Benutzer existiert nicht oder das angegebene Passwort ist falsch.'
        }
    }
}
