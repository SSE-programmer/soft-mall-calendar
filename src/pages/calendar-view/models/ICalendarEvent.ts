export interface ICalendarEvent {
    name: string;
    description: string;
    fullDay: boolean;
    dateStart: number;
    dateEnd: number;
    timeStart?: number | null;
    timeEnd?: number | null;
}
