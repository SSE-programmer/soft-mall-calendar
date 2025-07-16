export interface ICalendarEvent {
    id?: number
    name: string;
    description: string;
    fullDay: boolean;
    dateStart: Date;
    dateEnd: Date;
    timeStart?: Date | null;
    timeEnd?: Date | null;
}
