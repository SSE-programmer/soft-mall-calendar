import { hoursToMinutes } from 'date-fns';

export const MINUTES_IN_DAY = 24 * 60;

export const getTopPositionByTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const totalMinutes = hoursToMinutes(hours) + minutes;

    return `${totalMinutes / MINUTES_IN_DAY * 100}%`;
};
