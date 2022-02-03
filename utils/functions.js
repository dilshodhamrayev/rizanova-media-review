import React from 'react';

export const tryParseJSON = jsonString => {
    try {
        var o = JSON.parse(jsonString);

        if (o && typeof o === 'object') {
            return o;
        }
    } catch (e) { }

    return jsonString;
};

export function number_format(
    number,
    decimals = 0,
    dec_point = '.',
    thousands_sep = ' ',
) {
    // Strip all characters but numerical ones.
    number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
        dec = typeof dec_point === 'undefined' ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
            var k = Math.pow(10, prec);
            return '' + Math.round(n * k) / k;
        };
    // Fix for IE parseFloat(0.55).toFixed(0) = 0;
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
    }
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
}

export const arrayToFormData = (data) => {
    let formData = new FormData();

    for (let prop in data) {
        if (Array.isArray(data[prop])) {
            for (let index in data[prop]) {
                if (
                    !(data[prop][index] instanceof File) &&
                    typeof data[prop][index] === 'object'
                ) {
                    for (let p in data[prop][index]) {
                        formData.append(
                            prop + '[' + index + '][' + p + ']',
                            data[prop][index][p],
                        );
                    }
                } else {
                    formData.append(prop + '[]', data[prop][index]);
                }
            }
        } else {
            formData.append(prop, data[prop]);
        }
    }

    return formData;
};

export function useIsMounted() {
    const ref = React.useRef(true);

    React.useEffect(() => {
        return () => {
            ref.current = false;
        };
    }, []);

    return React.useCallback(() => ref.current, []);
}

export function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export function toSeconds(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

export function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    let newArray = [...array];

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
}

export const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "O'", "G'"/*, "Sh", "Ch"*/];

export function toHHMMSS (seconds) {
    let str = new Date(seconds * 1000).toISOString().substr(11, 8);

    return str.startsWith("00:") ? new Date(seconds * 1000).toISOString().substr(14, 5) : str;
}