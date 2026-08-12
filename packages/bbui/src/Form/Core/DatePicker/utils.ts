interface Input {
  max: number
  pad: number
  fallback: string
}

interface LocaleWeekInfo {
  firstDay?: number
}

interface LocaleWithWeekInfo {
  readonly weekInfo?: LocaleWeekInfo
  getWeekInfo?: () => LocaleWeekInfo
}

export type Weekday =
  | "Sunday"
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"

const DEFAULT_WEEKDAY: Weekday = "Monday"
const WEEKDAY_BY_INDEX: Weekday[] = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
]

// Fallback data for browsers without Intl.Locale week information support.
// Regions not listed use CLDR's global Monday default.
// Source: unicode-org/cldr-json/cldr-json/cldr-core/supplemental/weekData.json
const SUNDAY_START_REGIONS = new Set(
  "AG AS BD BR BS BT BW BZ CA CO DM DO ET GT GU HK HN ID IL IN IS JM JP KE KH KR LA MH MM MO MT MX MZ NI NP PA PE PH PK PR PT SA SG SV TH TT TW UM US VE VI WS YE ZA ZW".split(
    " "
  )
)
const SATURDAY_START_REGIONS = new Set(
  "AF BH DJ DZ EG IQ IR JO KW LY OM QA SD SY".split(" ")
)
const FRIDAY_START_REGIONS = new Set(["MV"])

const normalizeLocaleCode = (code?: string | null) => {
  if (!code) {
    return null
  }
  return code.toLowerCase().replace(/_/g, "-")
}

const getNavigatorLocales = (): readonly string[] => {
  if (typeof navigator === "undefined") {
    return []
  }
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return navigator.languages
  }
  return navigator.language ? [navigator.language] : []
}

const getFallbackFirstDay = (locale: Intl.Locale): number => {
  const region = locale.region ?? locale.maximize().region
  if (region && SUNDAY_START_REGIONS.has(region)) {
    return 7
  }
  if (region && SATURDAY_START_REGIONS.has(region)) {
    return 6
  }
  if (region && FRIDAY_START_REGIONS.has(region)) {
    return 5
  }
  return 1
}

const getLocaleFirstDay = (code: string): number | undefined => {
  if (typeof Intl.Locale !== "function") {
    return undefined
  }

  try {
    const locale = new Intl.Locale(code) as Intl.Locale & LocaleWithWeekInfo
    const weekInfo = locale.weekInfo ?? locale.getWeekInfo?.()
    return weekInfo?.firstDay ?? getFallbackFirstDay(locale)
  } catch {
    return undefined
  }
}

export const getLocaleStartDayOfWeek = (
  locales: readonly string[] = getNavigatorLocales()
): Weekday => {
  for (const locale of locales) {
    const normalized = normalizeLocaleCode(locale)
    if (!normalized) {
      continue
    }
    const firstDay = getLocaleFirstDay(normalized)
    if (typeof firstDay === "number" && firstDay >= 1 && firstDay <= 7) {
      return WEEKDAY_BY_INDEX[firstDay % 7]
    }
  }
  return DEFAULT_WEEKDAY
}

export const cleanInput = ({ max, pad, fallback }: Input) => {
  return (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.value) {
      const value = parseInt(target.value)
      if (isNaN(value)) {
        target.value = fallback
      } else {
        target.value = Math.min(max, value).toString().padStart(pad, "0")
      }
    } else {
      target.value = fallback
    }
  }
}
