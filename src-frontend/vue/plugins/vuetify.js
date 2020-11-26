import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';
import de from 'vuetify/es5/locale/de';
import colors from 'vuetify/es5/util/colors'

Vue.use(Vuetify);

export default new Vuetify({
   
    lang: {
        locales: { de },
        current: 'de'
    }, theme: {
        themes: {
          light: {
            primary: '#42A5F5',
            accent: '#C8553D',
            secondary: '#3E505B',
            success: '#4CAF50',
            info: '#2196F3',
            warning: '#FB8C00',
            error: '#FF5252'
          }
        }
      }
   
});
