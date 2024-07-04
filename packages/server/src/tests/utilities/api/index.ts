import TestConfiguration from "../TestConfiguration"
import { ApplicationAPI } from "./application"
import { AttachmentAPI } from "./attachment"
import { BackupAPI } from "./backup"
import { DatasourceAPI } from "./datasource"
import { LegacyViewAPI } from "./legacyView"
import { PermissionAPI } from "./permission"
import { QueryAPI } from "./query"
import { RoleAPI } from "./role"
import { RowAPI } from "./row"
import { ScreenAPI } from "./screen"
import { TableAPI } from "./table"
import { TemplateAPI } from "./template"
import { UserAPI } from "./user"
import { ViewV2API } from "./viewV2"

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
  }
}
