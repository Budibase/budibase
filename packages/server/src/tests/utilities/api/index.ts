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
import { EnvironmentAPI } from "./environment"
import { UserPublicAPI } from "./public/user"
import { MiscAPI } from "./misc"
import { OAuth2API } from "./oauth2"
import { AssetsAPI } from "./assets"
import { AIAPI } from "./ai"
import { WorkspaceAppAPI } from "./workspaceApp"

export default class API {
  ai: AIAPI
  application: ApplicationAPI
  attachment: AttachmentAPI
  automation: AutomationAPI
  backup: BackupAPI
  datasource: DatasourceAPI
  environment: EnvironmentAPI
  legacyView: LegacyViewAPI
  misc: MiscAPI
  oauth2: OAuth2API
  permission: PermissionAPI
  plugin: PluginAPI
  query: QueryAPI
  roles: RoleAPI
  row: RowAPI
  rowAction: RowActionAPI
  screen: ScreenAPI
  table: TableAPI
  templates: TemplateAPI
  user: UserAPI
  viewV2: ViewV2API
  webhook: WebhookAPI
  assets: AssetsAPI
  workspaceApp: WorkspaceAppAPI

  public: {
    user: UserPublicAPI
  }

  constructor(config: TestConfiguration) {
    this.ai = new AIAPI(config)
    this.application = new ApplicationAPI(config)
    this.attachment = new AttachmentAPI(config)
    this.automation = new AutomationAPI(config)
    this.backup = new BackupAPI(config)
    this.datasource = new DatasourceAPI(config)
    this.environment = new EnvironmentAPI(config)
    this.legacyView = new LegacyViewAPI(config)
    this.misc = new MiscAPI(config)
    this.oauth2 = new OAuth2API(config)
    this.permission = new PermissionAPI(config)
    this.plugin = new PluginAPI(config)
    this.query = new QueryAPI(config)
    this.roles = new RoleAPI(config)
    this.row = new RowAPI(config)
    this.rowAction = new RowActionAPI(config)
    this.screen = new ScreenAPI(config)
    this.table = new TableAPI(config)
    this.templates = new TemplateAPI(config)
    this.user = new UserAPI(config)
    this.viewV2 = new ViewV2API(config)
    this.webhook = new WebhookAPI(config)
    this.assets = new AssetsAPI(config)
    this.workspaceApp = new WorkspaceAppAPI(config)
    this.public = {
      user: new UserPublicAPI(config),
    }
  }
}
