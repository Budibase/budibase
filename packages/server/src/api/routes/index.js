const authRoutes = require("./auth")
const pageRoutes = require("./pages")
const userRoutes = require("./user")
const instanceRoutes = require("./instance")
const clientRoutes = require("./client")
const applicationRoutes = require("./application")
const tableRoutes = require("./table")
const recordRoutes = require("./record")
const viewRoutes = require("./view")
const staticRoutes = require("./static")
const componentRoutes = require("./component")
const automationRoutes = require("./automation")
const accesslevelRoutes = require("./accesslevel")
const deployRoutes = require("./deploy")
const apiKeysRoutes = require("./apikeys")
const templatesRoutes = require("./templates")
const analyticsRoutes = require("./analytics")

module.exports = {
  deployRoutes,
  authRoutes,
  pageRoutes,
  userRoutes,
  instanceRoutes,
  clientRoutes,
  applicationRoutes,
  recordRoutes,
  tableRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes,
  automationRoutes,
  accesslevelRoutes,
  apiKeysRoutes,
  templatesRoutes,
  analyticsRoutes,
}
