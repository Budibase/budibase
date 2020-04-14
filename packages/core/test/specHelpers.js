import path from "path"
import {
  getRecordApi,
  getCollectionApi,
  getIndexApi,
  getActionsApi,
} from "../src"
import memory from "./memory"
import { setupDatastore } from "../src/appInitialise"
import {
  configFolder,
  fieldDefinitions,
  templateDefinitions,
  joinKey,
  isSomething,
  crypto as nodeCrypto,
} from "../src/common"
import { getNewIndexTemplate } from "../src/templateApi/createNodes"
import { indexTypes } from "../src/templateApi/indexes"
import getTemplateApi from "../src/templateApi"
import getAuthApi from "../src/authApi"
import { createEventAggregator } from "../src/appInitialise/eventAggregator"
import { filter, find } from "lodash/fp"
import { createBehaviourSources } from "../src/actionsApi/buildBehaviourSource"
import { createAction, createTrigger } from "../src/templateApi/createActions"
import { initialiseActions } from "../src/actionsApi/initialise"
import { setCleanupFunc } from "../src/transactions/setCleanupFunc"
import { permission } from "../src/authApi/permissions"
import { generateFullPermissions } from "../src/authApi/generateFullPermissions"
import { initialiseData } from "../src/appInitialise/initialiseData"

export const testFileArea = testNameArea =>
  path.join("test", "fs_test_area", testNameArea)
export const testConfigFolder = testAreaName =>
  path.join(testFileArea(testAreaName), configFolder)
export const testFieldDefinitionsPath = testAreaName =>
  path.join(testFileArea(testAreaName), fieldDefinitions)
export const testTemplatesPath = testAreaName =>
  path.join(testFileArea(testAreaName), templateDefinitions)

export const getMemoryStore = () => setupDatastore(memory({}))
export const getMemoryTemplateApi = store => {
  const app = {
    datastore: store || getMemoryStore(),
    publish: () => { },
    getEpochTime: async () => new Date().getTime(),
    user: { name: "", permissions: [permission.writeTemplates.get()] },
  }
  app.removePermission = removePermission(app)
  app.withOnlyThisPermission = withOnlyThisPermission(app)
  app.withNoPermissions = withNoPermissions(app)
  const templateApi = getTemplateApi(app)
  templateApi._eventAggregator = createEventAggregator()
  templateApi._storeHandle = app.datastore
  return { templateApi, app }
}

// TODO: subscribe actions
export const appFromTempalteApi = async (
  templateApi,
  disableCleanupTransactions = false
) => {
  const appDef = await templateApi.getApplicationDefinition()
  const app = {
    hierarchy: appDef.hierarchy,
    datastore: templateApi._storeHandle,
    publish: templateApi._eventAggregator.publish,
    _eventAggregator: templateApi._eventAggregator,
    getEpochTime: async () => new Date().getTime(),
    crypto: nodeCrypto,
    user: { name: "bob", permissions: [] },
    actions: {},
  }
  app.removePermission = removePermission(app)
  app.withOnlyThisPermission = withOnlyThisPermission(app)
  app.withNoPermissions = withNoPermissions(app)

  const fullPermissions = generateFullPermissions(app)
  app.user.permissions = fullPermissions

  if (disableCleanupTransactions) setCleanupFunc(app, async () => { })
  else setCleanupFunc(app)

  return app
}

const removePermission = app => perm => {
  app.user.permissions = filter(
    p =>
      p.type !== perm.type ||
      (isSomething(perm.nodeKey) && perm.nodeKey !== p.nodeKey)
  )(app.user.permissions)
}

const withOnlyThisPermission = app => perm => (app.user.permissions = [perm])

const withNoPermissions = app => () => (app.user.permissions = [])

export const getRecordApiFromTemplateApi = async (
  templateApi,
  disableCleanupTransactions = false
) => {
  const app = await appFromTempalteApi(templateApi, disableCleanupTransactions)
  const recordapi = getRecordApi(app)
  recordapi._storeHandle = app.datastore
  return recordapi
}

export const getCollectionApiFromTemplateApi = async (
  templateApi,
  disableCleanupTransactions = false
) =>
  getCollectionApi(
    await appFromTempalteApi(templateApi, disableCleanupTransactions)
  )

export const getIndexApiFromTemplateApi = async (
  templateApi,
  disableCleanupTransactions = false
) =>
  getIndexApi(await appFromTempalteApi(templateApi, disableCleanupTransactions))

export const getAuthApiFromTemplateApi = async (
  templateApi,
  disableCleanupTransactions = false
) =>
  getAuthApi(await appFromTempalteApi(templateApi, disableCleanupTransactions))

export const findIndex = (parentNode, name) =>
  find(i => i.name === name)(parentNode.indexes)

export const findCollectionDefaultIndex = recordCollectionNode =>
  findIndex(recordCollectionNode.parent(), recordCollectionNode.name + "_index")

export const hierarchyFactory = (...additionalFeatures) => templateApi => {
  const root = templateApi.getNewRootLevel()

  const settingsRecord = templateApi.getNewSingleRecordTemplate(root)
  settingsRecord.name = "settings"

  const customerRecord = templateApi.getNewModelTemplate(root, "customer")
  customerRecord.collectionName = "customers"
  findCollectionDefaultIndex(customerRecord).map =
    "return {surname:record.surname, isalive:record.isalive, partner:record.partner};"

  const partnerRecord = templateApi.getNewModelTemplate(root, "partner")
  partnerRecord.collectionName = "partners"

  const partnerInvoiceRecord = templateApi.getNewModelTemplate(
    partnerRecord,
    "invoice"
  )
  partnerInvoiceRecord.collectionName = "invoices"
  findCollectionDefaultIndex(partnerInvoiceRecord).name =
    "partnerInvoices_index"

  const invoiceRecord = templateApi.getNewModelTemplate(
    customerRecord,
    "invoice"
  )
  invoiceRecord.collectionName = "invoices"
  findCollectionDefaultIndex(invoiceRecord).map =
    "return {createdDate: record.createdDate, totalIncVat: record.totalIncVat};"

  const chargeRecord = templateApi.getNewModelTemplate(invoiceRecord, "charge")
  chargeRecord.collectionName = "charges"

  const hierarchy = {
    root,
    customerRecord,
    invoiceRecord,
    partnerRecord,
    partnerInvoiceRecord,
    chargeRecord,
    settingsRecord,
  }

  for (let feature of additionalFeatures) {
    feature(hierarchy, templateApi)
  }
  return hierarchy
}

export const basicAppHierarchyCreator = templateApis =>
  hierarchyFactory()(templateApis)

export const withFields = (hierarchy, templateApi) => {
  const {
    customerRecord,
    invoiceRecord,
    partnerInvoiceRecord,
    chargeRecord,
    partnerRecord,
    settingsRecord,
    root,
  } = hierarchy

  getNewFieldAndAdd(templateApi, settingsRecord)("appName", "string", "")

  const newCustomerField = getNewFieldAndAdd(templateApi, customerRecord)

  const partnersReferenceIndex = templateApi.getNewIndexTemplate(root)
  partnersReferenceIndex.name = "partnersReference"
  partnersReferenceIndex.map =
    "return {name:record.businessName, phone:record.phone};"
  partnersReferenceIndex.allowedRecordNodeIds = [partnerRecord.nodeId]

  const partnerCustomersReverseIndex = templateApi.getNewIndexTemplate(
    partnerRecord,
    indexTypes.reference
  )
  partnerCustomersReverseIndex.name = "partnerCustomers"
  partnerCustomersReverseIndex.map = "return {...record};"
  partnerCustomersReverseIndex.filter = "record.isalive === true"
  partnerCustomersReverseIndex.allowedRecordNodeIds = [customerRecord.nodeId]
  hierarchy.partnerCustomersReverseIndex = partnerCustomersReverseIndex

  newCustomerField("surname", "string")
  newCustomerField("isalive", "bool", "true")
  newCustomerField("createddate", "datetime")
  newCustomerField("age", "number")
  newCustomerField("profilepic", "file")
  newCustomerField("partner", "reference", undefined, {
    indexNodeKey: "/partnersReference",
    displayValue: "name",
    reverseIndexNodeKeys: [
      joinKey(partnerRecord.nodeKey(), "partnerCustomers"),
    ],
  })

  const referredToCustomersReverseIndex = templateApi.getNewIndexTemplate(
    customerRecord,
    indexTypes.reference
  )
  referredToCustomersReverseIndex.name = "referredToCustomers"
  referredToCustomersReverseIndex.map = "return {...record};"
  referredToCustomersReverseIndex.getShardName =
    "return !record.surname ? 'null' : record.surname.substring(0,1);"
  referredToCustomersReverseIndex.allowedRecordNodeIds = [customerRecord.nodeId]
  hierarchy.referredToCustomersReverseIndex = referredToCustomersReverseIndex

  const customerReferredByField = newCustomerField(
    "referredBy",
    "reference",
    undefined,
    {
      indexNodeKey: "/customer_index",
      displayValue: "surname",
      reverseIndexNodeKeys: [
        joinKey(customerRecord.nodeKey(), "referredToCustomers"),
      ],
    }
  )
  hierarchy.customerReferredByField = customerReferredByField

  const newInvoiceField = getNewFieldAndAdd(templateApi, invoiceRecord)

  const invoiceTotalIncVatField = newInvoiceField("totalIncVat", "number")
  invoiceTotalIncVatField.typeOptions.decimalPlaces = 2
  newInvoiceField("createdDate", "datetime")
  newInvoiceField("paidAmount", "number")
  newInvoiceField("invoiceType", "string")
  newInvoiceField("isWrittenOff", "bool")

  const newPartnerField = getNewFieldAndAdd(templateApi, partnerRecord)
  newPartnerField("businessName", "string")
  newPartnerField("phone", "string")

  const newPartnerInvoiceField = getNewFieldAndAdd(
    templateApi,
    partnerInvoiceRecord
  )
  const partnerInvoiceTotalIncVatVield = newPartnerInvoiceField(
    "totalIncVat",
    "number"
  )
  partnerInvoiceTotalIncVatVield.typeOptions.decimalPlaces = 2
  newPartnerInvoiceField("createdDate", "datetime")
  newPartnerInvoiceField("paidAmount", "number")

  const newChargeField = getNewFieldAndAdd(templateApi, chargeRecord)
  newChargeField("amount", "number")

  newChargeField("partnerInvoice", "reference", undefined, {
    reverseIndexNodeKeys: [
      joinKey(partnerInvoiceRecord.nodeKey(), "partnerCharges"),
    ],
    displayValue: "createdDate",
    indexNodeKey: joinKey(partnerRecord.nodeKey(), "partnerInvoices_index"),
  })

  const partnerChargesReverseIndex = templateApi.getNewIndexTemplate(
    partnerInvoiceRecord,
    indexTypes.reference
  )
  partnerChargesReverseIndex.name = "partnerCharges"
  partnerChargesReverseIndex.map = "return {...record};"
  partnerChargesReverseIndex.allowedRecordNodeIds = [chargeRecord]
  hierarchy.partnerChargesReverseIndex = partnerChargesReverseIndex

  const customersReferenceIndex = templateApi.getNewIndexTemplate(
    hierarchy.root
  )
  customersReferenceIndex.name = "customersReference"
  customersReferenceIndex.map = "return {name:record.surname}"
  customersReferenceIndex.filter = "record.isalive === true"
  customersReferenceIndex.allowedRecordNodeIds = [customerRecord.nodeId]

  newInvoiceField("customer", "reference", undefined, {
    indexNodeKey: "/customersReference",
    reverseIndexNodeKeys: [findCollectionDefaultIndex(invoiceRecord).nodeKey()],
    displayValue: "name",
  })
}

export const withIndexes = (hierarchy, templateApi) => {
  const {
    root,
    customerRecord,
    partnerInvoiceRecord,
    invoiceRecord,
    partnerRecord,
    chargeRecord,
  } = hierarchy
  const deceasedCustomersIndex = getNewIndexTemplate(root)
  deceasedCustomersIndex.name = "deceased"
  deceasedCustomersIndex.map =
    "return {surname: record.surname, age:record.age};"
  deceasedCustomersIndex.filter = "record.isalive === false"
  findCollectionDefaultIndex(customerRecord).map = "return record;"
  deceasedCustomersIndex.allowedRecordNodeIds = [customerRecord.nodeId]

  findCollectionDefaultIndex(invoiceRecord).allowedRecordNodeIds = [
    invoiceRecord.nodeId,
  ]
  findCollectionDefaultIndex(customerRecord).allowedRecordNodeIds = [
    customerRecord.nodeId,
  ]
  findCollectionDefaultIndex(partnerRecord).allowedRecordNodeIds = [
    partnerRecord.nodeId,
  ]
  findIndex(partnerRecord, "partnerInvoices_index").allowedRecordNodeIds = [
    partnerInvoiceRecord.nodeId,
  ]
  findCollectionDefaultIndex(chargeRecord).allowedRecordNodeIds = [
    chargeRecord.nodeId,
  ]

  const customerInvoicesIndex = getNewIndexTemplate(root)
  customerInvoicesIndex.name = "customer_invoices"
  customerInvoicesIndex.map = "return record;"
  customerInvoicesIndex.filter = "record.type === 'invoice'"
  customerInvoicesIndex.allowedRecordNodeIds = [invoiceRecord.nodeId]

  const outstandingInvoicesIndex = getNewIndexTemplate(root)
  outstandingInvoicesIndex.name = "Outstanding Invoices"
  outstandingInvoicesIndex.filter =
    "record.type === 'invoice' && record.paidAmount < record.totalIncVat"
  outstandingInvoicesIndex.map = "return {...record};"
  outstandingInvoicesIndex.allowedRecordNodeIds = [
    invoiceRecord.nodeId,
    partnerInvoiceRecord.nodeId,
  ]

  const allInvoicesAggregateGroup = templateApi.getNewAggregateGroupTemplate(
    outstandingInvoicesIndex
  )
  allInvoicesAggregateGroup.name = "all_invoices"

  const allInvoicesByType = templateApi.getNewAggregateGroupTemplate(
    outstandingInvoicesIndex
  )
  allInvoicesByType.groupBy = "return record.invoiceType"
  allInvoicesByType.name = "all_invoices_by_type"

  const allInvoicesTotalAmountAggregate = templateApi.getNewAggregateTemplate(
    allInvoicesByType
  )
  allInvoicesTotalAmountAggregate.name = "totalIncVat"
  allInvoicesTotalAmountAggregate.aggregatedValue = "return record.totalIncVat"

  const allInvoicesPaidAmountAggregate = templateApi.getNewAggregateTemplate(
    allInvoicesByType
  )
  allInvoicesPaidAmountAggregate.name = "paidAmount"
  allInvoicesPaidAmountAggregate.aggregatedValue = "return record.paidAmount"

  const writtenOffInvoicesByType = templateApi.getNewAggregateGroupTemplate(
    outstandingInvoicesIndex
  )
  writtenOffInvoicesByType.groupBy = "return record.invoiceType"
  writtenOffInvoicesByType.name = "written_off"
  writtenOffInvoicesByType.condition = "record.isWrittenOff === true"

  const writtenOffInvoicesTotalAmountAggregate = templateApi.getNewAggregateTemplate(
    writtenOffInvoicesByType
  )
  writtenOffInvoicesTotalAmountAggregate.name = "totalIncVat"
  writtenOffInvoicesTotalAmountAggregate.aggregatedValue =
    "return record.totalIncVat"

  const customersBySurnameIndex = templateApi.getNewIndexTemplate(root)
  customersBySurnameIndex.name = "customersBySurname"
  customersBySurnameIndex.map = "return {...record};"
  customersBySurnameIndex.filter = ""
  customersBySurnameIndex.allowedRecordNodeIds = [customerRecord.nodeId]
  customersBySurnameIndex.getShardName =
    "return !record.surname ? 'null' : record.surname.substring(0,1);"

  const customersDefaultIndex = findCollectionDefaultIndex(customerRecord)
  const customersNoGroupaggregateGroup = templateApi.getNewAggregateGroupTemplate(
    customersDefaultIndex
  )
  customersNoGroupaggregateGroup.name = "Customers Summary"
  const allCustomersAgeFunctions = templateApi.getNewAggregateTemplate(
    customersNoGroupaggregateGroup
  )
  allCustomersAgeFunctions.aggregatedValue = "return record.age"
  allCustomersAgeFunctions.name = "all customers - age breakdown"

  const invoicesByOutstandingIndex = templateApi.getNewIndexTemplate(
    customerRecord
  )
  invoicesByOutstandingIndex.name = "invoicesByOutstanding"
  invoicesByOutstandingIndex.map = "return {...record};"
  invoicesByOutstandingIndex.filter = ""
  invoicesByOutstandingIndex.getShardName =
    "return (record.totalIncVat > record.paidAmount ? 'outstanding' : 'paid');"
  invoicesByOutstandingIndex.allowedRecordNodeIds = [
    partnerInvoiceRecord.nodeId,
    invoiceRecord.nodeId,
  ]
  const allInvoicesByType_Sharded = templateApi.getNewAggregateGroupTemplate(
    invoicesByOutstandingIndex
  )
  allInvoicesByType_Sharded.groupBy = "return record.invoiceType"
  allInvoicesByType_Sharded.name = "all_invoices_by_type"

  const allInvoicesTotalAmountAggregate_Sharded = templateApi.getNewAggregateTemplate(
    allInvoicesByType_Sharded
  )
  allInvoicesTotalAmountAggregate_Sharded.name = "totalIncVat"
  allInvoicesTotalAmountAggregate_Sharded.aggregatedValue =
    "return record.totalIncVat"

  hierarchy.allInvoicesByType = allInvoicesByType
  hierarchy.allInvoicesTotalAmountAggregate = allInvoicesTotalAmountAggregate
  hierarchy.allInvoicesPaidAmountAggregate = allInvoicesPaidAmountAggregate
  hierarchy.customersDefaultIndex = customersDefaultIndex
  hierarchy.allCustomersAgeFunctions = allCustomersAgeFunctions
  hierarchy.customersNoGroupaggregateGroup = customersNoGroupaggregateGroup
  hierarchy.invoicesByOutstandingIndex = invoicesByOutstandingIndex
  hierarchy.customersBySurnameIndex = customersBySurnameIndex
  hierarchy.outstandingInvoicesIndex = outstandingInvoicesIndex
  hierarchy.deceasedCustomersIndex = deceasedCustomersIndex
  hierarchy.customerInvoicesIndex = customerInvoicesIndex
}

export const basicAppHierarchyCreator_WithFields = templateApi =>
  hierarchyFactory(withFields)(templateApi)

export const basicAppHierarchyCreator_WithFields_AndIndexes = templateApi =>
  hierarchyFactory(withFields, withIndexes)(templateApi)

export const setupApphierarchy = async (
  creator,
  disableCleanupTransactions = false
) => {
  const { templateApi } = getMemoryTemplateApi()
  const hierarchy = creator(templateApi)
  await initialiseData(templateApi._storeHandle, {
    hierarchy: hierarchy.root,
    actions: [],
    triggers: [],
  })
  await templateApi.saveApplicationHierarchy(hierarchy.root)
  const app = await appFromTempalteApi(templateApi, disableCleanupTransactions)
  const collectionApi = getCollectionApi(app)
  const indexApi = getIndexApi(app)
  const authApi = getAuthApi(app)
  const actionsApi = getActionsApi(app)
  const recordApi = await getRecordApi(app)
  recordApi._storeHandle = app.datastore
  actionsApi._app = app

  const apis = {
    recordApi,
    collectionApi,
    templateApi,
    indexApi,
    authApi,
    actionsApi,
    appHierarchy: hierarchy,
    subscribe: templateApi._eventAggregator.subscribe,
    app,
  }

  return apis
}

export const getNewFieldAndAdd = (templateApi, record) => (
  name,
  type,
  initial,
  typeOptions
) => {
  const field = templateApi.getNewField(type)
  field.name = name
  field.getInitialValue = !initial ? "default" : initial
  if (typeOptions) field.typeOptions = typeOptions
  templateApi.addField(record, field)
  return field
}

export const stubEventHandler = () => {
  const events = []
  return {
    handle: (name, context) => {
      events.push({ name, context })
    },
    events,
    getEvents: n => filter(e => e.name === n)(events),
  }
}

export const createValidActionsAndTriggers = () => {
  const logMessage = createAction()
  logMessage.name = "logMessage"
  logMessage.behaviourName = "log"
  logMessage.behaviourSource = "budibase-behaviours"

  const measureCallTime = createAction()
  measureCallTime.name = "measureCallTime"
  measureCallTime.behaviourName = "call_timer"
  measureCallTime.behaviourSource = "budibase-behaviours"

  const sendEmail = createAction()
  sendEmail.name = "sendEmail"
  sendEmail.behaviourName = "send_email"
  sendEmail.behaviourSource = "my-custom-lib"

  const logOnErrorTrigger = createTrigger()
  logOnErrorTrigger.actionName = "logMessage"
  logOnErrorTrigger.eventName = "recordApi:save:onError"
  logOnErrorTrigger.optionsCreator = "return context.error.message;"

  const timeCustomerSaveTrigger = createTrigger()
  timeCustomerSaveTrigger.actionName = "measureCallTime"
  timeCustomerSaveTrigger.eventName = "recordApi:save:onComplete"
  timeCustomerSaveTrigger.optionsCreator = "return 999;"
  timeCustomerSaveTrigger.condition = "context.record.type === 'customer'"

  const allActions = [logMessage, measureCallTime, sendEmail]
  const allTriggers = [logOnErrorTrigger, timeCustomerSaveTrigger]

  const behaviourSources = createBehaviourSources()
  const logs = []
  const call_timers = []
  const emails = []
  behaviourSources.register("budibase-behaviours", {
    log: message => logs.push(message),
    call_timer: opts => call_timers.push(opts),
  })
  behaviourSources.register("my-custom-lib", {
    send_email: em => emails.push(em),
  })

  return {
    logMessage,
    measureCallTime,
    sendEmail,
    logOnErrorTrigger,
    timeCustomerSaveTrigger,
    allActions,
    allTriggers,
    behaviourSources,
    logs,
    call_timers,
    emails,
  }
}

export const createAppDefinitionWithActionsAndTriggers = async () => {
  const {
    appHierarchy,
    templateApi,
    app,
    actionsApi,
  } = await setupApphierarchy(basicAppHierarchyCreator_WithFields)

  // adding validation rule so it can fail when we save it
  templateApi.addRecordValidationRule(appHierarchy.customerRecord)(
    templateApi.commonRecordValidationRules.fieldNotEmpty("surname")
  )

  await templateApi.saveApplicationHierarchy(appHierarchy.root)

  const actionsAndTriggers = createValidActionsAndTriggers()
  const { allActions, allTriggers, behaviourSources } = actionsAndTriggers
  await templateApi.saveActionsAndTriggers(allActions, allTriggers)
  app.actions = initialiseActions(
    templateApi._eventAggregator.subscribe,
    behaviourSources,
    allActions,
    allTriggers
  )
  app.user.permissions = generateFullPermissions(app)
  app.behaviourSources = behaviourSources
  const appDefinition = await templateApi.getApplicationDefinition()
  return {
    templateApi,
    appDefinition,
    ...actionsAndTriggers,
    ...appHierarchy,
    app,
    actionsApi,
  }
}

export const validUser = async (
  app,
  authApi,
  password,
  enabled = true,
  accessLevels = null
) => {
  const access = await authApi.getNewAccessLevel(app)
  access.name = "admin"
  permission.setPassword.add(access)

  const access2 = await authApi.getNewAccessLevel(app)
  access2.name = "admin2"
  permission.setPassword.add(access)

  await authApi.saveAccessLevels({ version: 0, levels: [access, access2] })

  const u = authApi.getNewUser(app)
  u.name = "bob"
  if (accessLevels === null) u.accessLevels = ["admin"]
  else u.accessLevels = accessLevels

  u.enabled = enabled

  await authApi.createUser(u, password)
  return u
}
