const authRoutes = require("./auth")
const pageRoutes = require("./pages")
const screenRoutes = require("./screen")
const userRoutes = require("./user")
const applicationRoutes = require("./application")
const tableRoutes = require("./table")
const rowRoutes = require("./row")
const viewRoutes = require("./view")
const staticRoutes = require("./static")
const componentRoutes = require("./component")
const automationRoutes = require("./automation")
const webhookRoutes = require("./webhook")
const accesslevelRoutes = require("./accesslevel")
const deployRoutes = require("./deploy")
const apiKeysRoutes = require("./apikeys")
const templatesRoutes = require("./templates")
const analyticsRoutes = require("./analytics")

module.exports = {
  deployRoutes,
  authRoutes,
  pageRoutes,
  screenRoutes,
  userRoutes,
  applicationRoutes,
  rowRoutes,
  tableRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes,
  automationRoutes,
  accesslevelRoutes,
  apiKeysRoutes,
  templatesRoutes,
  analyticsRoutes,
  webhookRoutes,
}
