import * as API from "./api"
import { authStore, routeStore, screenStore, bindingStore } from "./store"
import { styleable } from "./utils/styleable"
import { linkable } from "./utils/linkable"
import DataProvider from "./components/DataProvider.svelte"

export default {
  API,
  authStore,
  routeStore,
  screenStore,
  styleable,
  linkable,
  DataProvider,
  setBindableValue: bindingStore.actions.setBindableValue,
}
