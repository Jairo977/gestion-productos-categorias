import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3001'  // URL donde JSON Server está corriendo
});

export default api;
