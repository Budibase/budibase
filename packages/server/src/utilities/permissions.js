const viewController = require("../api/controllers/view")
const tableController = require("../api/controllers/table")
const automationController = require("../api/controllers/automation")
const accessLevels = require("./security/accessLevels")

// this has been broken out to reduce risk of circular dependency from utilities, no enums defined here
const generateAdminPermissions = async appId => [
  ...accessLevels.adminPermissions,
  ...(await generatePowerUserPermissions(appId)),
]

const generatePowerUserPermissions = async appId => {
  const fetchTablesCtx = {
    user: {
      appId,
    },
  }
  await tableController.fetch(fetchTablesCtx)
  const tables = fetchTablesCtx.body

  const fetchViewsCtx = {
    user: {
      appId,
    },
  }
  await viewController.fetch(fetchViewsCtx)
  const views = fetchViewsCtx.body

  const fetchAutomationsCtx = {
    user: {
      appId,
    },
  }
  await automationController.fetch(fetchAutomationsCtx)
  const automations = fetchAutomationsCtx.body

  const readTablePermissions = tables.map(m => ({
    itemId: m._id,
    name: accessLevels.READ_TABLE,
  }))

  const writeTablePermissions = tables.map(m => ({
    itemId: m._id,
    name: accessLevels.WRITE_TABLE,
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
    ...readTablePermissions,
    ...writeTablePermissions,
    ...viewPermissions,
    ...executeAutomationPermissions,
    { name: accessLevels.LIST_USERS },
  ]
}
module.exports.generateAdminPermissions = generateAdminPermissions
module.exports.generatePowerUserPermissions = generatePowerUserPermissions
