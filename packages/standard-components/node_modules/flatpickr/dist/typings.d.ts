import { FlatpickrFn } from "./types/instance";
import { Instance as _Instance } from "./types/instance";
import {
  Options as _Options,
  Hook as _Hook,
  HookKey as _HookKey,
  ParsedOptions as _ParsedOptions,
  DateLimit as _DateLimit,
  DateOption as _DateOption,
  DateRangeLimit as _DateRangeLimit,
  Plugin as _Plugin,
} from "./types/options";

import {
  Locale as _Locale,
  CustomLocale as _CustomLocale,
  key as _LocaleKey,
} from "./types/locale";

declare var flatpickr: FlatpickrFn;

declare namespace flatpickr {
  export type Instance = _Instance;
  export type CustomLocale = _CustomLocale;
  export type Locale = _Locale;

  export namespace Options {
    export type Options = _Options;
    export type Hook = _Hook;
    export type HookKey = _HookKey;
    export type ParsedOptions = _ParsedOptions;
    export type DateLimit = _DateLimit;
    export type DateOption = _DateOption;
    export type DateRangeLimit = _DateRangeLimit;
    export type Plugin = _Plugin;
    export type LocaleKey = _LocaleKey;
  }
}

export default flatpickr;
