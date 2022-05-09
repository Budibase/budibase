import { API } from "api"
import {
  authStore,
  notificationStore,
  routeStore,
  screenStore,
  builderStore,
  uploadStore,
  rowSelectionStore,
  componentStore,
} from "stores"
import { styleable } from "utils/styleable"
import { linkable } from "utils/linkable"
import { getAction } from "utils/getAction"
import Provider from "components/context/Provider.svelte"
import { ActionTypes } from "./constants"
import { fetchDatasourceSchema } from "./utils/schema.js"

export default {
  API,
  authStore,
  notificationStore,
  routeStore,
  rowSelectionStore,
  screenStore,
  builderStore,
  uploadStore,
  componentStore,
  styleable,
  linkable,
  getAction,
  fetchDatasourceSchema,
  Provider,
  ActionTypes,
}
