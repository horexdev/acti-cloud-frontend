import { defineStore } from 'pinia'
import axios from 'axios';

export const useAxios = defineStore('axios', () => {
    axios.defaults.baseURL = "http://127.0.0.1:5666";

    let obj = {
        get: axios.get,
        put: axios.put,
        post: axios.post,
        delete: axios.delete
    }

    return obj;
})
