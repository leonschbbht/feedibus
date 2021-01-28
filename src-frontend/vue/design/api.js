import Axios from 'axios';

export default class api {
    static async messages () {
        const response = await Axios.get('/messages');

        return response.data;
    }

    static async tags () {
        const response = await Axios.get('/tags');
        return response.data;
    }

    /**
     * @param {string} name
     * @param {string} color
     */
    static async createTag (name, color) {
        const data = {
            name: name,
            color: color
        };
        const response = await Axios.post('/tags', data);
        if (response.status === 200) {
            return '';
        } else if (typeof response.data === 'string') {
            return response.data;
        }
    }

    static async deleteTag (id) {
        const response = await Axios.delete('/tags?id=' + id);
        if (response.status === 200) {
            return ''
        } else if (typeof response.data === 'string') {
            return response.data;
        }
    }

    static async feeds () {
        const response = await Axios.get('/subscriptions')
        if (response.status === 200) {
            return '';
        } else if (typeof response.data === 'string') {
            return response.data;
        }
    }

    static async createFeed (type, url, name, tags) {
        const data = {
            type: type,
            url: url,
            name: name,
            tags: tags
        };
        console.log('Erstelle ' + JSON.stringify(data, null, 2))
        const response = await Axios.post('/subscriptions', data);
        console.log(JSON.stringify(response, null, 2))
        if (response.status === 200) {
            return '';
        } else if (typeof response.data === 'string') {
            return response.data;
        }
    }
}
