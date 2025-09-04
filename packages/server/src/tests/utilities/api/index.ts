import TestConfiguration from "../TestConfiguration"
import { AIAPI } from "./ai"
import { AssetsAPI } from "./assets"
import { AttachmentAPI } from "./attachment"
import { AutomationAPI } from "./automation"
import { BackupAPI } from "./backup"
import { DatasourceAPI } from "./datasource"
import { DeployAPI } from "./deploy"
import { EnvironmentAPI } from "./environment"
import { LegacyViewAPI } from "./legacyView"
import { MiscAPI } from "./misc"
import { NavigationAPI } from "./navigation"
import { OAuth2API } from "./oauth2"
import { PermissionAPI } from "./permission"
import { PluginAPI } from "./plugin"
import { RowPublicAPI } from "./public/row"
import { UserPublicAPI } from "./public/user"
import { QueryAPI } from "./query"
import { RecaptchaAPI } from "./recaptcha"
import { ResourceAPI } from "./resource"
import { RoleAPI } from "./role"
import { RoutingAPI } from "./routing"
import { RowAPI } from "./row"
import { RowActionAPI } from "./rowAction"
import { ScreenAPI } from "./screen"
import { TableAPI } from "./table"
import { TemplateAPI } from "./template"
import { UserAPI } from "./user"
import { ViewV2API } from "./viewV2"
import { WebhookAPI } from "./webhook"
import { WorkspaceAPI } from "./workspace"
import { WorkspaceAppAPI } from "./workspaceApp"
import { WorkspaceFavouriteAPI } from "./workspaceFavourite"

export default class API {
  ai: AIAPI
  workspace: WorkspaceAPI
  attachment: AttachmentAPI
  automation: AutomationAPI
  backup: BackupAPI
  datasource: DatasourceAPI
  deploy: DeployAPI
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
  resource: ResourceAPI
  navigation: NavigationAPI
  recaptcha: RecaptchaAPI
  routing: RoutingAPI
  workspaceFavourites: WorkspaceFavouriteAPI

  public: {
    user: UserPublicAPI
    row: RowPublicAPI
  }

  constructor(config: TestConfiguration) {
    this.ai = new AIAPI(config)
    this.workspace = new WorkspaceAPI(config)
    this.attachment = new AttachmentAPI(config)
    this.automation = new AutomationAPI(config)
    this.backup = new BackupAPI(config)
    this.datasource = new DatasourceAPI(config)
    this.deploy = new DeployAPI(config)
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
    this.resource = new ResourceAPI(config)
    this.navigation = new NavigationAPI(config)
    this.recaptcha = new RecaptchaAPI(config)
    this.routing = new RoutingAPI(config)
    this.workspaceFavourites = new WorkspaceFavouriteAPI(config)
    this.public = {
      user: new UserPublicAPI(config),
      row: new RowPublicAPI(config),
    }
  }
}
