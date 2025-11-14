import type { Locale } from "date-fns"
import * as dateFnsLocales from "date-fns/locale"

interface Input {
  max: number
  pad: number
  fallback: string
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

const normalizeLocaleCode = (code?: string | null) => {
  if (!code) {
    return null
  }
  return code.toLowerCase().replace(/_/g, "-")
}

const normalizeLocaleKey = (key?: string) => {
  if (!key) {
    return null
  }
  return key
    .replace(/_/g, "-")
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .toLowerCase()
}

const localeLookup = (() => {
  const lookup = new Map<string, Locale>()

  const register = (key: string, locale: Locale | undefined) => {
    if (!locale) {
      return
    }
    const codeCandidates = new Set<string>()
    const normalizedKey = normalizeLocaleKey(key)
    if (normalizedKey) {
      codeCandidates.add(normalizedKey)
    }
    const normalizedLocaleCode = normalizeLocaleCode(locale.code)
    if (normalizedLocaleCode) {
      codeCandidates.add(normalizedLocaleCode)
    }
    for (const candidate of codeCandidates) {
      if (!lookup.has(candidate)) {
        lookup.set(candidate, locale)
      }
      const base = candidate.split("-")[0]
      if (base && !lookup.has(base)) {
        lookup.set(base, locale)
      }
    }
  }

  for (const [key, locale] of Object.entries(dateFnsLocales)) {
    if (typeof locale === "object" && locale) {
      register(key, locale as Locale)
    }
  }

  return lookup
})()

const getNavigatorLocales = (): readonly string[] => {
  if (typeof navigator === "undefined") {
    return []
  }
  if (Array.isArray(navigator.languages) && navigator.languages.length > 0) {
    return navigator.languages
  }
  return navigator.language ? [navigator.language] : []
}

export const getLocaleStartDayOfWeek = (
  locales: readonly string[] = getNavigatorLocales()
): Weekday => {
  for (const locale of locales) {
    const normalized = normalizeLocaleCode(locale)
    if (!normalized) {
      continue
    }
    const match =
      localeLookup.get(normalized) || localeLookup.get(normalized.split("-")[0])
    const weekStartsOn = match?.options?.weekStartsOn
    if (typeof weekStartsOn === "number") {
      const index = ((weekStartsOn % 7) + 7) % 7
      return WEEKDAY_BY_INDEX[index]
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
