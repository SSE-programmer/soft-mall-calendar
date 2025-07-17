import {setHours, setMinutes, setSeconds, setMilliseconds} from 'date-fns';

export function combineDateAndTime(date: Date, time: Date) {
    const combined = new Date(date);

    return setMilliseconds(
        setSeconds(
            setMinutes(
                setHours(
                    combined,
                    time.getHours()
                ),
                time.getMinutes()
            ),
            time.getSeconds()
        ),
        time.getMilliseconds()
    );
}
