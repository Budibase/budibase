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
  appStore,
  stateStore,
  createContextStore,
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
import { processStringSync, makePropSafe } from "@budibase/string-templates"
import {
  fetchData,
  LuceneUtils,
  Constants,
  RowUtils,
  memo,
  derivedMemo,
} from "@budibase/frontend-core"

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
  LuceneUtils,
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
