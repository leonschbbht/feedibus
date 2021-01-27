import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import de from 'vuetify/es5/locale/de';

Vue.use(Vuetify);

export default new Vuetify({

    lang: {
        locales: { de },
        current: 'de'
    },
    theme: {
        themes: {
            light: {
                primary: '#26A69A',
                accent: '#f5f7f8',
                secondary: '#00897B',
                success: '#004D40',
                info: '#B2DFDB',
                warning: '#F57F17',
                error: '#DD2C00'
            }
        }
    }

});
