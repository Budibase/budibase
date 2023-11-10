import TestConfiguration from "../TestConfiguration"
import { AccountAPI } from "./accounts"
import { AuthAPI } from "./auth"
import { ConfigAPI } from "./configs"
import { EmailAPI } from "./email"
import { SelfAPI } from "./self"
import { UserAPI } from "./users"
import { EnvironmentAPI } from "./environment"
import { MigrationAPI } from "./migrations"
import { StatusAPI } from "./status"
import { RestoreAPI } from "./restore"
import { TenantAPI } from "./tenants"
import { GroupsAPI } from "./groups"
import { RolesAPI } from "./roles"
import { TemplatesAPI } from "./templates"
import { LicenseAPI } from "./license"
import { AuditLogAPI } from "./auditLogs"
import { ScimUsersAPI } from "./scim/users"
import { ScimGroupsAPI } from "./scim/groups"

export default class API {
  accounts: AccountAPI
  auth: AuthAPI
  configs: ConfigAPI
  emails: EmailAPI
  self: SelfAPI
  users: UserAPI
  environment: EnvironmentAPI
  migrations: MigrationAPI
  status: StatusAPI
  restore: RestoreAPI
  tenants: TenantAPI
  groups: GroupsAPI
  roles: RolesAPI
  templates: TemplatesAPI
  license: LicenseAPI
  auditLogs: AuditLogAPI
  scimUsersAPI: ScimUsersAPI
  scimGroupsAPI: ScimGroupsAPI

  constructor(config: TestConfiguration) {
    this.accounts = new AccountAPI(config)
    this.auth = new AuthAPI(config)
    this.configs = new ConfigAPI(config)
    this.emails = new EmailAPI(config)
    this.self = new SelfAPI(config)
    this.users = new UserAPI(config)
    this.environment = new EnvironmentAPI(config)
    this.migrations = new MigrationAPI(config)
    this.status = new StatusAPI(config)
    this.restore = new RestoreAPI(config)
    this.tenants = new TenantAPI(config)
    this.groups = new GroupsAPI(config)
    this.roles = new RolesAPI(config)
    this.templates = new TemplatesAPI(config)
    this.license = new LicenseAPI(config)
    this.auditLogs = new AuditLogAPI(config)
    this.scimUsersAPI = new ScimUsersAPI(config)
    this.scimGroupsAPI = new ScimGroupsAPI(config)
  }
}
