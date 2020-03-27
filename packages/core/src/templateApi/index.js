import {
  getNewRootLevel,
  getNewRecordTemplate,
  getNewIndexTemplate,
  createNodeErrors,
  constructHierarchy,
  getNewAggregateGroupTemplate,
  getNewSingleRecordTemplate,
  getNewAggregateTemplate,
  constructNode,
} from "./createNodes"
import { getNewField, validateField, addField, fieldErrors } from "./fields"
import {
  getNewRecordValidationRule,
  commonRecordValidationRules,
  addRecordValidationRule,
} from "./recordValidationRules"
import { createAction, createTrigger } from "./createActions"
import {
  validateTriggers,
  validateTrigger,
  validateNode,
  validateActions,
  validateAll,
} from "./validate"
import { getApplicationDefinition } from "./getApplicationDefinition"
import { saveApplicationHierarchy } from "./saveApplicationHierarchy"
import { saveActionsAndTriggers } from "./saveActionsAndTriggers"
import { all } from "../types"
import { getBehaviourSources } from "./getBehaviourSources"
import { upgradeData } from "./upgradeData"

const api = app => ({
  getApplicationDefinition: getApplicationDefinition(app.datastore),
  saveApplicationHierarchy: saveApplicationHierarchy(app),
  saveActionsAndTriggers: saveActionsAndTriggers(app),
  getBehaviourSources: () => getBehaviourSources(app.datastore),
  getNewRootLevel,
  constructNode,
  getNewIndexTemplate,
  getNewRecordTemplate,
  getNewField,
  validateField,
  addField,
  fieldErrors,
  getNewRecordValidationRule,
  commonRecordValidationRules,
  addRecordValidationRule,
  createAction,
  createTrigger,
  validateActions,
  validateTrigger,
  getNewAggregateGroupTemplate,
  getNewAggregateTemplate,
  constructHierarchy,
  getNewSingleRecordTemplate,
  allTypes: all,
  validateNode,
  validateAll,
  validateTriggers,
  upgradeData: upgradeData(app),
})

export const getTemplateApi = app => api(app)

export const errors = createNodeErrors

export default getTemplateApi
