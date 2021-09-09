import * as API from "./api"
import {
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
} from "stores"
import { styleable } from "utils/styleable"
import { linkable } from "utils/linkable"
import { getAction } from "utils/getAction"
import Provider from "components/context/Provider.svelte"
import { ActionTypes } from "constants"

export default {
  API,
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
  styleable,
  linkable,
  getAction,
  Provider,
  ActionTypes,
}
