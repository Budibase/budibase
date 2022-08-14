export enum ContextKey {
  TENANT_ID = "tenantId",
  GLOBAL_DB = "globalDb",
  APP_ID = "appId",
  IDENTITY = "identity",
  // whatever the request app DB was
  CURRENT_DB = "currentDb",
  // get the prod app DB from the request
  PROD_DB = "prodDb",
  // get the dev app DB from the request
  DEV_DB = "devDb",
  DB_OPTS = "dbOpts",
  // check if something else is using the context, don't close DB
  TENANCY_IN_USE = "tenancyInUse",
  APP_IN_USE = "appInUse",
  IDENTITY_IN_USE = "identityInUse",
}
