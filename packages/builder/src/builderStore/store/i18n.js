import { register, init, getLocaleFromNavigator, locale } from "svelte-i18n"
import { localStorageStore } from "./localStorage"

const langMap = {
  "zh-hans": "zh-hans",
  "zh-CN": "zh-hans",
  "zh-hant": "zh-hant",
  "zh-HK": "zh-hant",
  "zh-MO": "zh-hant",
  "zh-SG": "zh-hant",
  "zh-TW": "zh-hant",

  en: "en-us",
  "en-us": "en-us",

  ja: "ja",
}

const langLabelMap = {
  "zh-hans": "简体中文",
  "zh-hant": "繁體中文",
  "en-us": "English",
  ja: "日本語",
}

const initialValue = {
  locale: langMap[getLocaleFromNavigator()] || "en-us",
  options: ["en-us", "zh-hans", "zh-hant", "ja"],
}

export const initI18n = () => {
  register("en-us", () => import("assets/lang/en-us.json"))
  register("zh-hans", () => import("assets/lang/zh-hans.json"))
  register("zh-hant", () => import("assets/lang/zh-hant.json"))
  register("ja", () => import("assets/lang/ja.json"))
  const store = JSON.parse(localStorage.getItem("bb-locale"))
  init({
    fallbackLocale: "en-us",
    initialLocale: store.locale,
  })
}

export const getLabel = key => langLabelMap[key]

export const getLocaleStore = () => {
  const store = localStorageStore("bb-locale", initialValue)
  store.subscribe(state => locale.set(state.locale))

  return store
}
