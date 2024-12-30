import TestConfiguration from "../TestConfiguration"
import { PermissionAPI } from "./permission"
import { RowAPI } from "./row"
import { TableAPI } from "./table"
import { ViewV2API } from "./viewV2"
import { DatasourceAPI } from "./datasource"
import { LegacyViewAPI } from "./legacyView"
import { ScreenAPI } from "./screen"
import { ApplicationAPI } from "./application"
import { BackupAPI } from "./backup"
import { AttachmentAPI } from "./attachment"
import { UserAPI } from "./user"
import { QueryAPI } from "./query"
import { RoleAPI } from "./role"
import { TemplateAPI } from "./template"
import { RowActionAPI } from "./rowAction"
import { AutomationAPI } from "./automation"
import { PluginAPI } from "./plugin"
import { WebhookAPI } from "./webhook"

export default class API {
  table: TableAPI
  legacyView: LegacyViewAPI
  viewV2: ViewV2API
  row: RowAPI
  permission: PermissionAPI
  datasource: DatasourceAPI
  screen: ScreenAPI
  application: ApplicationAPI
  backup: BackupAPI
  attachment: AttachmentAPI
  user: UserAPI
  query: QueryAPI
  roles: RoleAPI
  templates: TemplateAPI
  rowAction: RowActionAPI
  automation: AutomationAPI
  plugin: PluginAPI
  webhook: WebhookAPI

  constructor(config: TestConfiguration) {
    this.table = new TableAPI(config)
    this.legacyView = new LegacyViewAPI(config)
    this.viewV2 = new ViewV2API(config)
    this.row = new RowAPI(config)
    this.permission = new PermissionAPI(config)
    this.datasource = new DatasourceAPI(config)
    this.screen = new ScreenAPI(config)
    this.application = new ApplicationAPI(config)
    this.backup = new BackupAPI(config)
    this.attachment = new AttachmentAPI(config)
    this.user = new UserAPI(config)
    this.query = new QueryAPI(config)
    this.roles = new RoleAPI(config)
    this.templates = new TemplateAPI(config)
    this.rowAction = new RowActionAPI(config)
    this.automation = new AutomationAPI(config)
    this.plugin = new PluginAPI(config)
    this.webhook = new WebhookAPI(config)
  }
}
