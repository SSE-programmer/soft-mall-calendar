export interface ICalendarEvent {
    id?: number;
    name: string;
    description: string;
    fullDay: boolean;
    dateStart: Date;
    dateEnd: Date;
    timeStart?: Date | null;
    timeEnd?: Date | null;
    calculatedStart: Date;
    calculatedEnd: Date;
}

export function isCalendarEvent(value: unknown): value is ICalendarEvent {
    return Boolean(value && typeof value === 'object' &&
        'name' in value &&
        'description' in value &&
        'fullDay' in value &&
        'dateStart' in value && (value.dateStart instanceof Date || typeof value.dateStart === 'number' || typeof value.dateStart === 'string') &&
        'dateEnd' in value && (value.dateEnd instanceof Date || typeof value.dateEnd === 'number' || typeof value.dateEnd === 'string')
    );
}
