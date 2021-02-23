import * as API from "./api"
import {
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
} from "./store"
import { styleable } from "./utils/styleable"
import { linkable } from "./utils/linkable"
import Provider from "./components/Provider.svelte"
import { ActionTypes } from "./constants"

export default {
  API,
  authStore,
  notifications: notificationStore,
  routeStore,
  screenStore,
  builderStore,
  styleable,
  linkable,
  Provider,
  ActionTypes,
}
