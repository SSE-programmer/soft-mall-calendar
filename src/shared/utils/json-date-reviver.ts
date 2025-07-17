import { isValid, parseISO } from 'date-fns';

export function reviver(key: string | symbol, value: unknown) {
    if (typeof value !== 'string') {
        return value;
    }

    const date = parseISO(value);

    if (isValid(date)) {
        return date;
    }

    return value;
}
