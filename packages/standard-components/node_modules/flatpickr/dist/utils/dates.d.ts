import { Locale } from "../types/locale";
import { ParsedOptions } from "../types/options";
export interface FormatterArgs {
    config?: ParsedOptions;
    l10n?: Locale;
    isMobile?: boolean;
}
export declare const createDateFormatter: ({ config, l10n, isMobile, }: FormatterArgs) => (dateObj: Date, frmt: string, overrideLocale?: Locale | undefined) => string;
export declare const createDateParser: ({ config, l10n }: {
    config?: ParsedOptions | undefined;
    l10n?: Locale | undefined;
}) => (date: Date | string | number, givenFormat?: string | undefined, timeless?: boolean | undefined, customLocale?: Locale | undefined) => Date | undefined;
export declare function compareDates(date1: Date, date2: Date, timeless?: boolean): number;
export declare function compareTimes(date1: Date, date2: Date): number;
export declare const isBetween: (ts: number, ts1: number, ts2: number) => boolean;
export declare const duration: {
    DAY: number;
};
export declare function getDefaultHours(config: ParsedOptions): {
    hours: number;
    minutes: number;
    seconds: number;
};
