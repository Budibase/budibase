import authRoutes from "./auth"
import layoutRoutes from "./layout"
import screenRoutes from "./screen"
import userRoutes from "./user"
import applicationRoutes from "./application"
import tableRoutes from "./table"
import rowRoutes from "./row"
import viewRoutes from "./view"
import componentRoutes from "./component"
import automationRoutes from "./automation"
import webhookRoutes from "./webhook"
import roleRoutes from "./role"
import deployRoutes from "./deploy"
import apiKeysRoutes from "./apikeys"
import templatesRoutes from "./templates"
import analyticsRoutes from "./analytics"
import routingRoutes from "./routing"
import integrationRoutes from "./integration"
import permissionRoutes from "./permission"
import datasourceRoutes from "./datasource"
import queryRoutes from "./query"
import backupRoutes from "./backup"
import metadataRoutes from "./metadata"
import devRoutes from "./dev"
import cloudRoutes from "./cloud"
import migrationRoutes from "./migrations"
import pluginRoutes from "./plugin"

export { default as staticRoutes } from "./static"
export { default as publicRoutes } from "./public"

export const mainRoutes = [
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
  backupRoutes,
  metadataRoutes,
  devRoutes,
  cloudRoutes,
  // these need to be handled last as they still use /api/:tableId
  // this could be breaking as koa may recognise other routes as this
  tableRoutes,
  rowRoutes,
  migrationRoutes,
  pluginRoutes,
]
