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
  modalStore,
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
import {
  fetchDatasourceSchema,
  fetchDatasourceDefinition,
} from "./utils/schema"
import { getAPIKey } from "./utils/api.js"
import { enrichButtonActions } from "./utils/buttonActions.js"
import { processStringSync, makePropSafe } from "@budibase/string-templates"
import {
  fetchData,
  QueryUtils,
  Constants,
  RowUtils,
  memo,
  derivedMemo,
} from "@budibase/frontend-core"
import { createValidatorFromConstraints } from "components/app/forms/validation"

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
  fetchDatasourceDefinition,
  fetchData,
  QueryUtils,
  ContextScopes: Constants.ContextScopes,
  // This is not used internally but exposed to users to be used in plugins
  getAPIKey,
  enrichButtonActions,
  processStringSync,
  makePropSafe,
  createContextStore,
  generateGoldenSample: RowUtils.generateGoldenSample,
  memo,
  derivedMemo,
  createValidatorFromConstraints,

  // Components
  Provider,
  Block,
  BlockComponent,

  // Constants
  ActionTypes,
}
