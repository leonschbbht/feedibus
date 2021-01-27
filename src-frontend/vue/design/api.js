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
}
