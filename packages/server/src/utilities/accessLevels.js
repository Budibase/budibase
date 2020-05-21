const viewController = require("../api/controllers/view")
const modelController = require("../api/controllers/model")

exports.ADMIN_LEVEL_ID = "ADMIN"
exports.POWERUSER_LEVEL_ID = "POWER_USER"

exports.READ_MODEL = "read-model"
exports.WRITE_MODEL = "write-model"
exports.READ_VIEW = "read-view"
exports.EXECUTE_WORKFLOW = "execute-workflow"
exports.USER_MANAGEMENT = "user-management"
exports.BUILDER = "builder"
exports.LIST_USERS = "list-users"

exports.adminPermissions = [
  {
    name: exports.USER_MANAGEMENT,
  },
]

exports.generateAdminPermissions = async instanceId => [
  ...exports.adminPermissions,
  ...(await exports.generatePowerUserPermissions(instanceId)),
]

exports.generatePowerUserPermissions = async instanceId => {
  const fetchModelsCtx = {
    params: {
      instanceId,
    },
  }
  await modelController.fetch(fetchModelsCtx)
  const models = fetchModelsCtx.body

  const fetchViewsCtx = {
    params: {
      instanceId,
    },
  }
  await viewController.fetch(fetchViewsCtx)
  const views = fetchViewsCtx.body

  const readModelPermissions = models.map(m => ({
    itemId: m._id,
    name: exports.READ_MODEL,
  }))

  const writeModelPermissions = models.map(m => ({
    itemId: m._id,
    name: exports.WRITE_MODEL,
  }))

  const viewPermissions = views.map(v => ({
    itemId: v.name,
    name: exports.READ_VIEW,
  }))

  return [
    ...readModelPermissions,
    ...writeModelPermissions,
    ...viewPermissions,
    { name: exports.LIST_USERS },
  ]
}
