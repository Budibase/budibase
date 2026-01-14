import { get } from "svelte/store"
import { API } from "@/api"
import { BudiStore } from "../BudiStore"
import {
  ConfigType,
  TranslationsConfig,
  TranslationsConfigInner,
  isTranslationsConfig,
} from "@budibase/types"
import { filterValidTranslationOverrides } from "@budibase/shared-core"
import { auth } from "./auth"

interface TranslationsState {
  loaded: boolean
  config: TranslationsConfigInner
}

export type TranslationOverrideMap = Record<string, string>

const DEFAULT_LOCALE = "en"

const DEFAULT_STATE: TranslationsState = {
  loaded: false,
  config: {
    defaultLocale: DEFAULT_LOCALE,
    locales: {},
  },
}

const defaultLocaleLabel = (locale: string) =>
  locale === DEFAULT_LOCALE ? "English" : locale

const ensureDefaultLocale = (
  source?: TranslationsConfigInner
): TranslationsConfigInner => {
  const defaultLocale = source?.defaultLocale || DEFAULT_LOCALE
  const locales: TranslationsConfigInner["locales"] = {}

  Object.entries(source?.locales || {}).forEach(([locale, value]) => {
    locales[locale] = {
      label: value?.label,
      overrides: filterValidTranslationOverrides(value?.overrides),
      updatedAt: value?.updatedAt,
      updatedBy: value?.updatedBy,
    }
  })

  if (!locales[defaultLocale]) {
    locales[defaultLocale] = {
      label: defaultLocaleLabel(defaultLocale),
      overrides: {},
    }
  }

  return {
    defaultLocale,
    locales,
  }
}

class TranslationsStore extends BudiStore<TranslationsState> {
  constructor() {
    super(DEFAULT_STATE)
  }

  private getActiveLocale(state: TranslationsState, locale?: string) {
    const config = ensureDefaultLocale(state.config)
    const key = locale || config.defaultLocale
    return {
      key,
      value: config.locales[key] || {
        label: defaultLocaleLabel(key),
        overrides: {},
      },
      config,
    }
  }

  async init(options: { force?: boolean; public?: boolean } = {}) {
    const force = options.force ?? false
    const usePublic = options.public ?? false

    const state = get(this.store)
    if (state.loaded && !force) {
      return
    }

    let config: TranslationsConfigInner | undefined
    if (usePublic) {
      const tenantId = get(auth).tenantId
      const response = await API.getPublicTranslations(tenantId)
      config = ensureDefaultLocale(response)
    } else {
      const response = await API.getConfig(ConfigType.TRANSLATIONS)
      const configDoc =
        response &&
        typeof response === "object" &&
        "type" in response &&
        isTranslationsConfig(response)
          ? (response as TranslationsConfig)
          : undefined
      config = ensureDefaultLocale(configDoc?.config)
    }
    this.set({ loaded: true, config: config ?? ensureDefaultLocale() })
  }

  getActiveOverrides(locale?: string) {
    const state = get(this.store)
    const { key, value } = this.getActiveLocale(state, locale)
    return { locale: key, overrides: { ...value.overrides } }
  }

  async saveLocaleOverrides(locale: string, overrides: TranslationOverrideMap) {
    const state = get(this.store)
    const { key, config } = this.getActiveLocale(state, locale)
    const updatedConfig: TranslationsConfigInner = {
      defaultLocale: config.defaultLocale,
      locales: {
        ...config.locales,
        [key]: {
          ...config.locales[key],
          label: config.locales[key]?.label || defaultLocaleLabel(key),
          overrides: filterValidTranslationOverrides(overrides),
          updatedAt: new Date().toISOString(),
        },
      },
    }

    await API.saveConfig({
      type: ConfigType.TRANSLATIONS,
      config: updatedConfig,
    })

    this.set({ loaded: true, config: updatedConfig })
  }
}

export const translations = new TranslationsStore()
