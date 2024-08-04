import { randomBytes } from 'crypto';
import addSeconds from 'date-fns/addSeconds';
import isBefore from 'date-fns/isBefore';

export const isExpired = (date: number | Date, expiryInSeconds: number) => {
    return isBefore(addSeconds(date, expiryInSeconds), Date.now());
};

export const arrayDiff = (newArray: any, oldArray: any) => {
    return newArray.filter((newItem: any) => {
        return (
            oldArray.filter((oldItem: any) => {
                return oldItem.id === newItem.id;
            }).length === 0
        );
    });
};

export const formatString = (str: string, obj: any) => str.replace(/\${(.*?)}/g, (x, g) => obj[g]);

export const isObjectEmpty = (obj: Object) => Object.keys(obj).length === 0;

export const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

export const getNestedObjectByStringKey = (obj: any, str: string) => {
    str = str.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    str = str.replace(/^\./, ''); // strip a leading dot
    const a = str.split('.');

    for (let i = 0, n = a.length; i < n; ++i) {
        const k = a[i];

        if (obj && k in obj) {
            obj = obj[k];
        } else {
            return null;
        }
    }

    return obj;
};

export const generateRandomWorkspaceName = () => {
    const randomBytesBuffer = randomBytes(4);
    return randomBytesBuffer.toString('hex');
};
