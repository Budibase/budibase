const viewController = require("../api/controllers/view")
const modelController = require("../api/controllers/model")
const automationController = require("../api/controllers/automation")
const accessLevels = require("./accessLevels")

// this has been broken out to reduce risk of circular dependency from utilities, no enums defined here
const generateAdminPermissions = async instanceId => [
  ...accessLevels.adminPermissions,
  ...(await generatePowerUserPermissions(instanceId)),
]

const generatePowerUserPermissions = async instanceId => {
  const fetchModelsCtx = {
    user: {
      instanceId,
    },
  }
  await modelController.fetch(fetchModelsCtx)
  const models = fetchModelsCtx.body

  const fetchViewsCtx = {
    user: {
      instanceId,
    },
  }
  await viewController.fetch(fetchViewsCtx)
  const views = fetchViewsCtx.body

  const fetchAutomationsCtx = {
    user: {
      instanceId,
    },
  }
  await automationController.fetch(fetchAutomationsCtx)
  const automations = fetchAutomationsCtx.body

  const readModelPermissions = models.map(m => ({
    itemId: m._id,
    name: accessLevels.READ_MODEL,
  }))

  const writeModelPermissions = models.map(m => ({
    itemId: m._id,
    name: accessLevels.WRITE_MODEL,
  }))

  const viewPermissions = views.map(v => ({
    itemId: v.name,
    name: accessLevels.READ_VIEW,
  }))

  const executeAutomationPermissions = automations.map(w => ({
    itemId: w._id,
    name: accessLevels.EXECUTE_AUTOMATION,
  }))

  return [
    ...readModelPermissions,
    ...writeModelPermissions,
    ...viewPermissions,
    ...executeAutomationPermissions,
    { name: accessLevels.LIST_USERS },
  ]
}
module.exports.generateAdminPermissions = generateAdminPermissions
module.exports.generatePowerUserPermissions = generatePowerUserPermissions
