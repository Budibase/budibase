import * as API from "./api"
import { authStore, routeStore, screenStore, bindingStore } from "./store"
import { styleable } from "./utils/styleable"
import { linkable } from "./utils/linkable"
import { getAppId } from "./utils/getAppId"
import DataProvider from "./components/DataProvider.svelte"

export default {
  API,
  authStore,
  routeStore,
  screenStore,
  styleable,
  linkable,
  getAppId,
  DataProvider,
  setBindableValue: bindingStore.actions.setBindableValue,
}
