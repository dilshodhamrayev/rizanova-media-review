import { tryParseJSON } from './functions';

let prefix = 'rizanova-media-';

export const storeData = async (key, value) => {

    try {
        if (typeof value === 'object') {
            delete value.ref;

            value = JSON.stringify(value);
        }

        localStorage.setItem((prefix + key), value);
    } catch (e) {
    }
};

export const getData = async key => {
    try {
        let data = localStorage.getItem((prefix + key));

        return tryParseJSON(data);
    } catch (error) { }
};

export const removeData = async key => {
    try {
        localStorage.removeItem((prefix + key));
    } catch (error) { }
};
