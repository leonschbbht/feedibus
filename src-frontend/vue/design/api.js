import Axios from 'axios';

export default class api {
    static async messages () {
        const response = await Axios.get('/messages');

        return response.data;
    }
}
