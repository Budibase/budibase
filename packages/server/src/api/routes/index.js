const authRoutes = require("./auth")
const layoutRoutes = require("./layout")
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
const roleRoutes = require("./role")
const deployRoutes = require("./deploy")
const apiKeysRoutes = require("./apikeys")
const templatesRoutes = require("./templates")
const analyticsRoutes = require("./analytics")
const routingRoutes = require("./routing")
const integrationRoutes = require("./integration")
const permissionRoutes = require("./permission")
const datasourceRoutes = require("./datasource")
const queryRoutes = require("./query")
const hostingRoutes = require("./hosting")
const backupRoutes = require("./backup")
const devRoutes = require("./dev")

exports.mainRoutes = [
  authRoutes,
  deployRoutes,
  layoutRoutes,
  screenRoutes,
  userRoutes,
  applicationRoutes,
  automationRoutes,
  viewRoutes,
  componentRoutes,
  roleRoutes,
  apiKeysRoutes,
  templatesRoutes,
  analyticsRoutes,
  webhookRoutes,
  routingRoutes,
  integrationRoutes,
  permissionRoutes,
  datasourceRoutes,
  queryRoutes,
  hostingRoutes,
  backupRoutes,
  devRoutes,
  // these need to be handled last as they still use /api/:tableId
  // this could be breaking as koa may recognise other routes as this
  tableRoutes,
  rowRoutes,
]

exports.staticRoutes = staticRoutes
