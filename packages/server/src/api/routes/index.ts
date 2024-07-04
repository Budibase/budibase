import { api as pro } from "@budibase/pro"
import Router from "@koa/router"
import analyticsRoutes from "./analytics"
import apiKeysRoutes from "./apikeys"
import applicationRoutes from "./application"
import authRoutes from "./auth"
import automationRoutes from "./automation"
import backupRoutes from "./backup"
import componentRoutes from "./component"
import datasourceRoutes from "./datasource"
import debugRoutes from "./debug"
import deployRoutes from "./deploy"
import devRoutes from "./dev"
import integrationRoutes from "./integration"
import layoutRoutes from "./layout"
import metadataRoutes from "./metadata"
import migrationRoutes from "./migrations"
import opsRoutes from "./ops"
import permissionRoutes from "./permission"
import pluginRoutes from "./plugin"
import queryRoutes from "./query"
import roleRoutes from "./role"
import routingRoutes from "./routing"
import rowRoutes from "./row"
import screenRoutes from "./screen"
import tableRoutes from "./table"
import templatesRoutes from "./templates"
import userRoutes from "./user"
import viewRoutes from "./view"
import webhookRoutes from "./webhook"

export { default as staticRoutes } from "./static"
export { default as publicRoutes } from "./public"

const appBackupRoutes = pro.appBackups
const environmentVariableRoutes = pro.environmentVariables

export const mainRoutes: Router[] = [
  appBackupRoutes,
  backupRoutes,
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
  metadataRoutes,
  devRoutes,
  rowRoutes,
  migrationRoutes,
  pluginRoutes,
  opsRoutes,
  debugRoutes,
  environmentVariableRoutes,
  // these need to be handled last as they still use /api/:tableId
  // this could be breaking as koa may recognise other routes as this
  tableRoutes,
]
