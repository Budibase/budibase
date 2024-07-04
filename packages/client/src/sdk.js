import {
  Constants,
  QueryUtils,
  RowUtils,
  derivedMemo,
  fetchData,
  memo,
} from "@budibase/frontend-core"
import { makePropSafe, processStringSync } from "@budibase/string-templates"
import { API } from "api"
import Block from "components/Block.svelte"
import BlockComponent from "components/BlockComponent.svelte"
import Provider from "components/context/Provider.svelte"
import {
  appStore,
  authStore,
  builderStore,
  componentStore,
  confirmationStore,
  createContextStore,
  currentRole,
  dndIsDragging,
  environmentStore,
  modalStore,
  notificationStore,
  roleStore,
  routeStore,
  rowSelectionStore,
  screenStore,
  sidePanelStore,
  stateStore,
  uploadStore,
} from "stores"
import { getAction } from "utils/getAction"
import { linkable } from "utils/linkable"
import { styleable } from "utils/styleable"
import { ActionTypes } from "./constants"
import { getAPIKey } from "./utils/api.js"
import { enrichButtonActions } from "./utils/buttonActions.js"
import { fetchDatasourceSchema } from "./utils/schema.js"

export default {
  API,

  // Stores
  authStore,
  appStore,
  notificationStore,
  routeStore,
  rowSelectionStore,
  screenStore,
  builderStore,
  uploadStore,
  componentStore,
  environmentStore,
  sidePanelStore,
  modalStore,
  dndIsDragging,
  currentRole,
  confirmationStore,
  roleStore,
  stateStore,

  // Utils
  styleable,
  linkable,
  getAction,
  fetchDatasourceSchema,
  fetchData,
  QueryUtils,
  ContextScopes: Constants.ContextScopes,
  getAPIKey,
  enrichButtonActions,
  processStringSync,
  makePropSafe,
  createContextStore,
  generateGoldenSample: RowUtils.generateGoldenSample,
  memo,
  derivedMemo,

  // Components
  Provider,
  Block,
  BlockComponent,

  // Constants
  ActionTypes,
}
