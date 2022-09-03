import { register, init, getLocaleFromNavigator, locale } from "svelte-i18n"
import { localStorageStore } from "./localStorage"

const langMap = {
  en: "en-us",
  "en-us": "en-us",

  fr: "fr",
}

const langLabelMap = {
  "en-us": "English",
  fr: "Francais",
}

const initialValue = {
  locale: langMap[getLocaleFromNavigator()] || "en-us",
  options: ["en-us", "fr"],
}

export const initI18n = () => {
  register("fr", () => import("assets/lang/fr.json"))
  const store = JSON.parse(localStorage.getItem("bb-locale"))
  init({
    fallbackLocale: "fr",
    initialLocale: store.locale,
  })
}

export const getLabel = key => langLabelMap[key]

export const getLocaleStore = () => {
  const store = localStorageStore("bb-locale", initialValue)
  store.subscribe(state => locale.set(state.locale))

  return store
}