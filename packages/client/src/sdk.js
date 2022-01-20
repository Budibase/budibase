import { SchemaUtils } from "@budibase/frontend-core"
import { API } from "./api.js"
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
  fetchDatasourceSchema: SchemaUtils.fetchDatasourceSchema,
  Provider,
  ActionTypes,
}
