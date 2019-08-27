import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-burger-app11.firebaseio.com/'
});

export default instance;