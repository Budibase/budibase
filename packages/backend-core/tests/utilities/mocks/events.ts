import * as processors from "../../../src/events/processors"
import * as events from "../../../src/events"

jest.spyOn(processors.analyticsProcessor, "processEvent")

jest.spyOn(events.identification, "identifyTenantGroup")
jest.spyOn(events.identification, "identifyUser")

jest.spyOn(events.backfill, "appSucceeded")
jest.spyOn(events.backfill, "tenantSucceeded")

jest.spyOn(events.account, "created")
jest.spyOn(events.account, "deleted")
jest.spyOn(events.account, "verified")

jest.spyOn(events.app, "created")
jest.spyOn(events.app, "updated")
jest.spyOn(events.app, "deleted")
jest.spyOn(events.app, "published")
jest.spyOn(events.app, "unpublished")
jest.spyOn(events.app, "templateImported")
jest.spyOn(events.app, "fileImported")
jest.spyOn(events.app, "versionUpdated")
jest.spyOn(events.app, "versionReverted")
jest.spyOn(events.app, "reverted")
jest.spyOn(events.app, "exported")

jest.spyOn(events.auth, "login")
jest.spyOn(events.auth, "logout")
jest.spyOn(events.auth, "SSOCreated")
jest.spyOn(events.auth, "SSOUpdated")
jest.spyOn(events.auth, "SSOActivated")
jest.spyOn(events.auth, "SSODeactivated")

jest.spyOn(events.automation, "created")
jest.spyOn(events.automation, "deleted")
jest.spyOn(events.automation, "tested")
jest.spyOn(events.automation, "stepCreated")
jest.spyOn(events.automation, "stepDeleted")
jest.spyOn(events.automation, "triggerUpdated")

jest.spyOn(events.datasource, "created")
jest.spyOn(events.datasource, "updated")
jest.spyOn(events.datasource, "deleted")

jest.spyOn(events.email, "SMTPCreated")
jest.spyOn(events.email, "SMTPUpdated")

jest.spyOn(events.layout, "created")
jest.spyOn(events.layout, "deleted")

jest.spyOn(events.org, "nameUpdated")
jest.spyOn(events.org, "logoUpdated")
jest.spyOn(events.org, "platformURLUpdated")
jest.spyOn(events.org, "analyticsOptOut")

jest.spyOn(events.installation, "versionChecked")

jest.spyOn(events.query, "created")
jest.spyOn(events.query, "updated")
jest.spyOn(events.query, "deleted")
jest.spyOn(events.query, "imported")
jest.spyOn(events.query, "previewed")

jest.spyOn(events.role, "created")
jest.spyOn(events.role, "updated")
jest.spyOn(events.role, "deleted")
jest.spyOn(events.role, "assigned")
jest.spyOn(events.role, "unassigned")

jest.spyOn(events.rows, "imported")
jest.spyOn(events.rows, "created")

jest.spyOn(events.screen, "created")
jest.spyOn(events.screen, "deleted")

jest.spyOn(events.user, "created")
jest.spyOn(events.user, "updated")
jest.spyOn(events.user, "deleted")
jest.spyOn(events.user, "permissionAdminAssigned")
jest.spyOn(events.user, "permissionAdminRemoved")
jest.spyOn(events.user, "permissionBuilderAssigned")
jest.spyOn(events.user, "permissionBuilderRemoved")
jest.spyOn(events.user, "invited")
jest.spyOn(events.user, "inviteAccepted")
jest.spyOn(events.user, "passwordForceReset")
jest.spyOn(events.user, "passwordUpdated")
jest.spyOn(events.user, "passwordResetRequested")
jest.spyOn(events.user, "passwordReset")

jest.spyOn(events.group, "created")
jest.spyOn(events.group, "updated")
jest.spyOn(events.group, "deleted")
jest.spyOn(events.group, "usersAdded")
jest.spyOn(events.group, "usersDeleted")
jest.spyOn(events.group, "createdOnboarding")
jest.spyOn(events.group, "permissionsEdited")

jest.spyOn(events.serve, "servedBuilder")
jest.spyOn(events.serve, "servedApp")
jest.spyOn(events.serve, "servedAppPreview")

jest.spyOn(events.table, "created")
jest.spyOn(events.table, "updated")
jest.spyOn(events.table, "deleted")
jest.spyOn(events.table, "exported")
jest.spyOn(events.table, "imported")

jest.spyOn(events.view, "created")
jest.spyOn(events.view, "updated")
jest.spyOn(events.view, "deleted")
jest.spyOn(events.view, "exported")
jest.spyOn(events.view, "filterCreated")
jest.spyOn(events.view, "filterUpdated")
jest.spyOn(events.view, "filterDeleted")
jest.spyOn(events.view, "calculationCreated")
jest.spyOn(events.view, "calculationUpdated")
jest.spyOn(events.view, "calculationDeleted")

jest.spyOn(events.plugin, "init")
jest.spyOn(events.plugin, "imported")
jest.spyOn(events.plugin, "deleted")

jest.spyOn(events.scim, "SCIMUserCreated")
jest.spyOn(events.scim, "SCIMUserUpdated")
jest.spyOn(events.scim, "SCIMUserDeleted")
