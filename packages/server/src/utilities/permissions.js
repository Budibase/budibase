const viewController = require("../api/controllers/view")
const modelController = require("../api/controllers/model")
const workflowController = require("../api/controllers/workflow")
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

  const fetchWorkflowsCtx = {
    user: {
      instanceId,
    },
  }
  await workflowController.fetch(fetchWorkflowsCtx)
  const workflows = fetchWorkflowsCtx.body

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

  const executeWorkflowPermissions = workflows.map(w => ({
    itemId: w._id,
    name: accessLevels.EXECUTE_WORKFLOW,
  }))

  return [
    ...readModelPermissions,
    ...writeModelPermissions,
    ...viewPermissions,
    ...executeWorkflowPermissions,
    { name: accessLevels.LIST_USERS },
  ]
}
module.exports.generateAdminPermissions = generateAdminPermissions
module.exports.generatePowerUserPermissions = generatePowerUserPermissions
