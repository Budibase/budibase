const { getTenantId } = require("../context")
const { analytics } = require("./analytics")
const { Events } = require("./constants")

const logEvent = messsage => {
  const tenantId = getTenantId()
  const userId = getTenantId() // TODO
  console.log(`[tenant=${tenantId}] [user=${userId}] ${messsage}`)
}

const processEvent = (event, properties) => {
  // logging
  logEvent(event)

  // analytics
  analytics.captureEvent(event, properties)
}

/**
------------------
    USER
------------------
*/

exports.userCreated = () => {
  const properties = {}
  processEvent(Events.USER_CREATED, properties)
}

exports.userUpdated = () => {
  const properties = {}
  processEvent(Events.USER_UPDATED, properties)
}

exports.userDeleted = () => {
  const properties = {}
  processEvent(Events.USER_DELETED, properties)
}

exports.userForcePasswordReset = () => {
  const properties = {}
  processEvent(Events.USER_PASSWORD_RESET, properties)
}

// PERMISSIONS

exports.userPermissionAdminAssigned = () => {
  const properties = {}
  processEvent(Events.USER_PERMISSION_ADMIN_ASSIGNED, properties)
}

exports.userPermissionAdminRemoved = () => {
  const properties = {}
  processEvent(Events.USER_PERMISSION_ADMIN_REMOVED, properties)
}

exports.userPermissionBuilderAssigned = () => {
  const properties = {}
  processEvent(Events.USER_PERMISSION_BUILDER_ASSIGNED, properties)
}

exports.userPermissionBuilderRemoved = () => {
  const properties = {}
  processEvent(Events.USER_PERMISSION_BUILDER_REMOVED, properties)
}

// INVITE

exports.userInvited = () => {
  const properties = {}
  processEvent(Events.USER_INVITED, properties)
}

exports.userInviteAccepted = () => {
  const properties = {}
  processEvent(Events.USER_INVITED_ACCEPTED, properties)
}

// SELF

exports.userSelfUpdated = () => {
  const properties = {}
  processEvent(Events.USER_SELF_UPDATED, properties)
}

exports.userSelfPasswordUpdated = () => {
  const properties = {}
  processEvent(Events.USER_SELF_PASSWORD_UPDATED, properties)
}

exports.userPasswordResetRequested = () => {
  const properties = {}
  processEvent(Events.USER_PASSWORD_RESET_REQUESTED, properties)
}

/**
 ------------------
      ADMIN
  ------------------
*/

// EMAIL

exports.emailSMTPCreated = () => {
  const properties = {}
  processEvent(Events.EMAIL_SMTP_CREATED, properties)
}

exports.emailSMTPUpdated = () => {
  const properties = {}
  processEvent(Events.EMAIL_SMTP_UPDATED, properties)
}

// AUTH

exports.authSSOCreated = () => {
  const properties = {}
  processEvent(Events.AUTH_SSO_CREATED, properties)
}

exports.authSSOUpdated = () => {
  const properties = {}
  processEvent(Events.AUTH_SSO_UPDATED, properties)
}

exports.authSSOActivated = () => {
  const properties = {}
  processEvent(Events.AUTH_SSO_ACTIVATED, properties)
}

exports.authSSODeactivated = () => {
  const properties = {}
  processEvent(Events.AUTH_SSO_DEACTIVATED, properties)
}

// ORG

exports.orgNameUpdated = () => {
  const properties = {}
  processEvent(Events.ORG_NAME_UPDATED, properties)
}

exports.orgLogoUpdated = () => {
  const properties = {}
  processEvent(Events.ORG_LOGO_UPDATED, properties)
}

exports.orgPlatformURLUpdated = () => {
  const properties = {}
  processEvent(Events.ORG_PLATFORM_URL_UPDATED, properties)
}

// UPDATE

exports.updateVersionChecked = () => {
  const properties = {}
  processEvent(Events.UPDATE_VERSION_CHECKED, properties)
}

// ANALYTICS

exports.analyticsOptOut = () => {
  const properties = {}
  processEvent(Events.ANALYTICS_OPT_OUT, properties)
}

/**
 ------------------
      APP
  ------------------
*/

// APP

exports.appCreated = () => {
  const properties = {}
  processEvent(Events.APP_CREATED, properties)
}

exports.appUpdated = () => {
  const properties = {}
  processEvent(Events.APP_UPDATED, properties)
}

exports.appDeleted = () => {
  const properties = {}
  processEvent(Events.APP_DELETED, properties)
}

exports.appPublished = () => {
  const properties = {}
  processEvent(Events.APP_PUBLISHED, properties)
}

exports.appUnpublished = () => {
  const properties = {}
  processEvent(Events.APP_UNPUBLISHED, properties)
}

exports.appImported = () => {
  const properties = {}
  processEvent(Events.APP_IMPORTED, properties)
}

exports.appVersionUpdated = () => {
  const properties = {}
  processEvent(Events.APP_VERSION_UPDATED, properties)
}

exports.appReverted = () => {
  const properties = {}
  processEvent(Events.APP_REVERTED, properties)
}

exports.appExported = () => {
  const properties = {}
  processEvent(Events.APP_EXPORTED, properties)
}

// ROLE

exports.appRoleCreated = () => {
  const properties = {}
  processEvent(Events.APP_ROLE_CREATED, properties)
}

exports.appRoleDeleted = () => {
  const properties = {}
  processEvent(Events.APP_ROLE_DELETED, properties)
}

exports.appRoleAssigned = () => {
  const properties = {}
  processEvent(Events.APP_ROLE_ASSIGNED, properties)
}

// CLIENT

exports.clientServed = () => {
  const properties = {}
  processEvent(Events.CLIENT_SERVED, properties)
}

/**
 ------------------
      DATA
  ------------------
*/

// DATASOURCE

exports.datasourceCreated = () => {
  const properties = {}
  processEvent(Events.DATASOURCE_CREATED, properties)
}

exports.datasourceUpdated = () => {
  const properties = {}
  processEvent(Events.DATASOURCE_UPDATED, properties)
}

exports.datasourceDeleted = () => {
  const properties = {}
  processEvent(Events.DATASOURCE_DELETED, properties)
}

// QUERY

exports.queryCreated = () => {
  const properties = {}
  processEvent(Events.QUERY_CREATED, properties)
}

exports.queryUpdated = () => {
  const properties = {}
  processEvent(Events.QUERY_UPDATED, properties)
}

exports.queryDeleted = () => {
  const properties = {}
  processEvent(Events.QUERY_DELETED, properties)
}

exports.queryImported = () => {
  const properties = {}
  processEvent(Events.QUERY_DELETED, properties)
}

exports.queryRun = () => {
  const properties = {}
  processEvent(Events.QUERY_DELETED, properties)
}

exports.queryPreview = () => {
  const properties = {}
  processEvent(Events.QUERY_DELETED, properties)
}

// TABLE

exports.tableCreated = () => {
  const properties = {}
  processEvent(Events.TABLE_CREATED, properties)
}

exports.tableUpdated = () => {
  const properties = {}
  processEvent(Events.TABLE_UPDATED, properties)
}

exports.tableDeleted = () => {
  const properties = {}
  processEvent(Events.TABLE_DELETED, properties)
}

exports.tableExported = () => {
  const properties = {}
  processEvent(Events.TABLE_EXPORTED, properties)
}

exports.tableImported = () => {
  const properties = {}
  processEvent(Events.TABLE_IMPORTED, properties)
}

exports.tablePermissionUpdated = () => {
  const properties = {}
  processEvent(Events.TABLE_PERMISSION_UPDATED, properties)
}

// VIEW

exports.viewCreated = () => {
  const properties = {}
  processEvent(Events.VIEW_CREATED, properties)
}

exports.viewUpdated = () => {
  const properties = {}
  processEvent(Events.VIEW_UPDATED, properties)
}

exports.viewDeleted = () => {
  const properties = {}
  processEvent(Events.VIEW_DELETED, properties)
}

exports.viewExported = () => {
  const properties = {}
  processEvent(Events.VIEW_EXPORTED, properties)
}

exports.viewFilterCreated = () => {
  const properties = {}
  processEvent(Events.VIEW_FILTER_CREATED, properties)
}

exports.viewFilterDeleted = () => {
  const properties = {}
  processEvent(Events.VIEW_FILTER_DELETED, properties)
}

exports.viewCalculationCreated = () => {
  const properties = {}
  processEvent(Events.VIEW_CALCULATION_CREATED, properties)
}

exports.viewCalculationDeleted = () => {
  const properties = {}
  processEvent(Events.VIEW_CALCULATION_DELETED, properties)
}

// ROW

exports.rowCreated = () => {
  const properties = {}
  processEvent(Events.ROW_CREATED, properties)
}

exports.rowImported = () => {
  const properties = {}
  processEvent(Events.ROW_IMPORTED, properties)
  exports.rowCreated()
}

exports.rowUpdated = () => {
  const properties = {}
  processEvent(Events.ROW_UPDATED, properties)
}

exports.rowDeleted = () => {
  const properties = {}
  processEvent(Events.ROW_DELETED, properties)
}

/**
 ------------------
      DESIGN
  ------------------
*/

// BUILDER

exports.builderServed = () => {
  const properties = {}
  processEvent(Events.BUILDER_SERVED, properties)
}

// COMPONENTS - are captured in the UI only

// SCREEN

exports.screenCreated = () => {
  const properties = {}
  processEvent(Events.SCREEN_CREATED, properties)
}

exports.screenDeleted = () => {
  const properties = {}
  processEvent(Events.SCREEN_DELETED, properties)
}

// LAYOUT

exports.layoutCreated = () => {
  const properties = {}
  processEvent(Events.LAYOUT_CREATED, properties)
}

exports.layoutDeleted = () => {
  const properties = {}
  processEvent(Events.LAYOUT_DELETED, properties)
}

/**
 ------------------
      AUTOMATE
  ------------------
*/

exports.automationCreated = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_CREATED, properties)
}

exports.automationDeleted = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_DELETED, properties)
}

exports.automationTested = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_TESTED, properties)
}

exports.automationRun = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_RUN, properties)
}

exports.automationStepCreated = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_STEP_CREATED, properties)
}

exports.automationStepDeleted = () => {
  const properties = {}
  processEvent(Events.AUTOMATION_STEP_DELETED, properties)
}

/**
 ------------------
      MISC
  ------------------
*/

// NPS

exports.npsSubmitted = () => {
  const properties = {}
  processEvent(Events.NPS_SUBMITTED, properties)
}

// AUTH

exports.login = () => {
  const properties = {}
  processEvent(Events.AUTH_LOGIN, properties)
}

exports.logout = () => {
  const properties = {}
  processEvent(Events.AUTH_LOGOUT, properties)
}
