import * as API from "./api"
import { authStore, routeStore, screenStore } from "./store"
import { styleable, getAppId } from "./utils"
import { link as linkable } from "svelte-spa-router"

export default {
  API,
  authStore,
  routeStore,
  screenStore,
  styleable,
  linkable,
  getAppId,
}
