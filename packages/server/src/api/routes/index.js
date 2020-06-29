const authRoutes = require("./auth")
const pageRoutes = require("./pages")
const userRoutes = require("./user")
const instanceRoutes = require("./instance")
const clientRoutes = require("./client")
const applicationRoutes = require("./application")
const modelRoutes = require("./model")
const recordRoutes = require("./record")
const viewRoutes = require("./view")
const staticRoutes = require("./static")
const componentRoutes = require("./component")
const workflowRoutes = require("./workflow")
const accesslevelRoutes = require("./accesslevel")
const deployRoutes = require("./deploy");

module.exports = {
  deployRoutes,
  authRoutes,
  pageRoutes,
  userRoutes,
  instanceRoutes,
  clientRoutes,
  applicationRoutes,
  recordRoutes,
  modelRoutes,
  viewRoutes,
  staticRoutes,
  componentRoutes,
  workflowRoutes,
  accesslevelRoutes,
}
