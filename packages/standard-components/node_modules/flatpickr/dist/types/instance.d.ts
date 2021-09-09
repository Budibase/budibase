import { DateOption, Options, ParsedOptions } from "./options";
import { Locale, CustomLocale, key as LocaleKey } from "./locale";
import { RevFormat, Formats, TokenRegex } from "../utils/formatting";
export interface Elements {
    element: HTMLElement;
    input: HTMLInputElement;
    altInput?: HTMLInputElement;
    _input: HTMLInputElement;
    mobileInput?: HTMLInputElement;
    mobileFormatStr?: string;
    selectedDateElem?: DayElement;
    todayDateElem?: DayElement;
    _positionElement: HTMLElement;
    weekdayContainer: HTMLDivElement;
    calendarContainer: HTMLDivElement;
    innerContainer?: HTMLDivElement;
    rContainer?: HTMLDivElement;
    daysContainer?: HTMLDivElement;
    days: HTMLDivElement;
    weekWrapper?: HTMLDivElement;
    weekNumbers?: HTMLDivElement;
    monthNav: HTMLDivElement;
    monthsDropdownContainer: HTMLSelectElement;
    yearElements: HTMLInputElement[];
    monthElements: HTMLSpanElement[];
    currentYearElement: HTMLInputElement;
    currentMonthElement: HTMLSpanElement;
    _hidePrevMonthArrow: boolean;
    _hideNextMonthArrow: boolean;
    prevMonthNav: HTMLElement;
    nextMonthNav: HTMLElement;
    timeContainer?: HTMLDivElement;
    hourElement?: HTMLInputElement;
    minuteElement?: HTMLInputElement;
    secondElement?: HTMLInputElement;
    amPM?: HTMLSpanElement;
    pluginElements: Node[];
}
export interface Formatting {
    revFormat: RevFormat;
    formats: Formats;
    tokenRegex: TokenRegex;
}
export declare type Instance = Elements & Formatting & {
    minRangeDate?: Date;
    maxRangeDate?: Date;
    now: Date;
    latestSelectedDateObj?: Date;
    _selectedDateObj?: Date;
    selectedDates: Date[];
    _initialDate: Date;
    config: ParsedOptions;
    loadedPlugins: string[];
    l10n: Locale;
    currentYear: number;
    currentMonth: number;
    isOpen: boolean;
    isMobile: boolean;
    minDateHasTime: boolean;
    maxDateHasTime: boolean;
    changeMonth: (value: number, isOffset?: boolean, fromKeyboard?: boolean) => void;
    changeYear: (year: number) => void;
    clear: (emitChangeEvent?: boolean, toInitial?: boolean) => void;
    close: () => void;
    destroy: () => void;
    isEnabled: (date: DateOption, timeless?: boolean) => boolean;
    jumpToDate: (date?: DateOption, triggerChange?: boolean) => void;
    open: (e?: FocusEvent | MouseEvent, positionElement?: HTMLElement) => void;
    redraw: () => void;
    set: (option: keyof Options | {
        [k in keyof Options]?: Options[k];
    }, value?: any) => void;
    setDate: (date: DateOption | DateOption[], triggerChange?: boolean, format?: string) => void;
    toggle: () => void;
    pad: (num: string | number) => string;
    parseDate: (date: Date | string | number, givenFormat?: string, timeless?: boolean) => Date | undefined;
    formatDate: (dateObj: Date, frmt: string) => string;
    _handlers: {
        remove: () => void;
    }[];
    _bind: <E extends Element>(element: E | E[], event: string | string[], handler: (e?: any) => void) => void;
    _createElement: <E extends HTMLElement>(tag: keyof HTMLElementTagNameMap, className: string, content?: string) => E;
    _setHoursFromDate: (date: Date) => void;
    _debouncedChange: () => void;
    __hideNextMonthArrow: boolean;
    __hidePrevMonthArrow: boolean;
    _positionCalendar: (customPositionElement?: HTMLElement) => void;
    utils: {
        getDaysInMonth: (month?: number, year?: number) => number;
    };
};
export interface FlatpickrFn {
    (selector: Node, config?: Options): Instance;
    (selector: ArrayLike<Node>, config?: Options): Instance[];
    (selector: string, config?: Options): Instance | Instance[];
    defaultConfig: Partial<ParsedOptions>;
    l10ns: {
        [k in LocaleKey]?: CustomLocale;
    } & {
        default: Locale;
    };
    localize: (l10n: CustomLocale) => void;
    setDefaults: (config: Options) => void;
    parseDate: (date: DateOption, format?: string, timeless?: boolean) => Date | undefined;
    formatDate: (date: Date, format: string) => string;
    compareDates: (date1: Date, date2: Date, timeless?: boolean) => number;
}
export declare type DayElement = HTMLSpanElement & {
    dateObj: Date;
    $i: number;
};
