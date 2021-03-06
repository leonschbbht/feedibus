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
        console.log(JSON.stringify(response, null, 2))
        return response.data;
    }

    static async createFeed (type, url, name, tags) {
        const data = {
            type: type,
            url: url,
            name: name,
            tags: tags
        };
        await Axios.post('/subscriptions', data);
    }

    static async deleteFeed (feedId) {
        await Axios.delete('/subscriptions?id=' + feedId);
    }

    static async getUser () {
        return await Axios.get('/user')
    }

    static async updatePassword (password) {
        const data = {
            password: password
        };
        await Axios.put('/user', data);
    }

    static async updateUserData (name, email) {
        const data = {
            name: name,
            email: email
        };
        await Axios.put('/user', data);
    }
}
