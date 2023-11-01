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
  currentRole,
  environmentStore,
  sidePanelStore,
  dndIsDragging,
  confirmationStore,
  roleStore,
} from "stores"
import { styleable } from "utils/styleable"
import { linkable } from "utils/linkable"
import { getAction } from "utils/getAction"
import Provider from "components/context/Provider.svelte"
import Block from "components/Block.svelte"
import BlockComponent from "components/BlockComponent.svelte"
import { ActionTypes } from "./constants"
import { fetchDatasourceSchema } from "./utils/schema.js"
import { getAPIKey } from "./utils/api.js"
import { enrichButtonActions } from "./utils/buttonActions.js"

export default {
  API,

  // Stores
  authStore,
  notificationStore,
  routeStore,
  rowSelectionStore,
  screenStore,
  builderStore,
  uploadStore,
  componentStore,
  environmentStore,
  sidePanelStore,
  dndIsDragging,
  currentRole,
  confirmationStore,
  roleStore,

  // Utils
  styleable,
  linkable,
  getAction,
  fetchDatasourceSchema,
  getAPIKey,
  enrichButtonActions,

  // Components
  Provider,
  Block,
  BlockComponent,

  // Constants
  ActionTypes,
}
