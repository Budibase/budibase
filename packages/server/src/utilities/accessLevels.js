const viewController = require("../api/controllers/view")
const modelController = require("../api/controllers/model")
const workflowController = require("../api/controllers/workflow")

// Access Level IDs
const ADMIN_LEVEL_ID = "ADMIN"
const POWERUSER_LEVEL_ID = "POWER_USER"
const BUILDER_LEVEL_ID = "BUILDER"
const ANON_LEVEL_ID = "ANON"

// Permissions
const READ_MODEL = "read-model"
const WRITE_MODEL = "write-model"
const READ_VIEW = "read-view"
const EXECUTE_WORKFLOW = "execute-workflow"
const USER_MANAGEMENT = "user-management"
const BUILDER = "builder"
const LIST_USERS = "list-users"

const adminPermissions = [
  {
    name: USER_MANAGEMENT,
  },
]

const generateAdminPermissions = async instanceId => [
  ...adminPermissions,
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
    name: READ_MODEL,
  }))

  const writeModelPermissions = models.map(m => ({
    itemId: m._id,
    name: WRITE_MODEL,
  }))

  const viewPermissions = views.map(v => ({
    itemId: v.name,
    name: READ_VIEW,
  }))

  const executeWorkflowPermissions = workflows.map(w => ({
    itemId: w._id,
    name: EXECUTE_WORKFLOW,
  }))

  return [
    ...readModelPermissions,
    ...writeModelPermissions,
    ...viewPermissions,
    ...executeWorkflowPermissions,
    { name: LIST_USERS },
  ]
}

module.exports = {
  ADMIN_LEVEL_ID,
  POWERUSER_LEVEL_ID,
  BUILDER_LEVEL_ID,
  ANON_LEVEL_ID,
  READ_MODEL,
  WRITE_MODEL,
  READ_VIEW,
  EXECUTE_WORKFLOW,
  USER_MANAGEMENT,
  BUILDER,
  LIST_USERS,
  adminPermissions,
  generateAdminPermissions,
  generatePowerUserPermissions,
}
