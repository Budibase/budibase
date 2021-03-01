import * as API from "./api"
import {
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
} from "./store"
import { styleable } from "./utils/styleable"
import transition from "./utils/transition"
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
  transition,
  linkable,
  Provider,
  ActionTypes,
}
