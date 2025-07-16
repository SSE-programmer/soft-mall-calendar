import { addDays, addMonths, addWeeks, addYears, subDays, subMonths, subWeeks, subYears } from 'date-fns';

export interface ISwitchStrategy {
    previous(date: Date): Date;

    next(date: Date): Date;
}

export class DaySwitchStrategy implements ISwitchStrategy {
    public previous(date: Date): Date {
        return subDays(date, 1);
    }

    public next(date: Date): Date {
        return addDays(date, 1);
    }
}

export class WeekSwitchStrategy implements ISwitchStrategy {
    public previous(date: Date): Date {
        return subWeeks(date, 1);
    }

    public next(date: Date): Date {
        return addWeeks(date, 1);
    }
}

export class MonthSwitchStrategy implements ISwitchStrategy {
    public previous(date: Date): Date {
        return subMonths(date, 1);
    }

    public next(date: Date): Date {
        return addMonths(date, 1);
    }
}

export class YearSwitchStrategy implements ISwitchStrategy {
    public previous(date: Date): Date {
        return subYears(date, 1);
    }

    public next(date: Date): Date {
        return addYears(date, 1);
    }
}
