import * as API from "./api"
import {
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
  uploadStore,
} from "stores"
import { styleable } from "utils/styleable"
import { linkable } from "utils/linkable"
import { getAction } from "utils/getAction"
import { fetchDatasourceSchema } from "utils/schema.js"
import Provider from "components/context/Provider.svelte"
import { ActionTypes } from "constants"

export default {
  API,
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
  uploadStore,
  styleable,
  linkable,
  getAction,
  fetchDatasourceSchema,
  Provider,
  ActionTypes,
}
