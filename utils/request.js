import axios from 'axios';
import { HOST_URL } from '../config';

export const post = async (url, data, params = {}) => {

    return axios.post(`${HOST_URL}/${url}`, data, params).then(response => response ? (response.data ? response.data : response) : null);
};

export const get = async (url, params = {}) => {
    let res = await axios.get(`${HOST_URL}/${url}`, params).then(response => response ? (response.data ? response.data : response) : null);
    
    return res;
};

export const fetcher = async (url) => {
    let res = await get(url);

    return res;
}