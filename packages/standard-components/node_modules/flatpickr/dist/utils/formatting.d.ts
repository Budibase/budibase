import { Locale } from "../types/locale";
import { ParsedOptions } from "../types/options";
export declare type token = "D" | "F" | "G" | "H" | "J" | "K" | "M" | "S" | "U" | "W" | "Y" | "Z" | "d" | "h" | "i" | "j" | "l" | "m" | "n" | "s" | "u" | "w" | "y";
export declare const monthToStr: (monthNumber: number, shorthand: boolean, locale: Locale) => string;
export declare type RevFormatFn = (date: Date, data: string, locale: Locale) => Date | void | undefined;
export declare type RevFormat = Record<string, RevFormatFn>;
export declare const revFormat: RevFormat;
export declare type TokenRegex = {
    [k in token]: string;
};
export declare const tokenRegex: TokenRegex;
export declare type Formats = Record<token, (date: Date, locale: Locale, options: ParsedOptions) => string | number>;
export declare const formats: Formats;
