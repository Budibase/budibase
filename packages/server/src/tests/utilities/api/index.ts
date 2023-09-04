import TestConfiguration from "../TestConfiguration"
import { PermissionAPI } from "./permission"
import { RowAPI } from "./row"
import { TableAPI } from "./table"
import { ViewV2API } from "./viewV2"
import { DatasourceAPI } from "./datasource"

export default class API {
  table: TableAPI
  viewV2: ViewV2API
  row: RowAPI
  permission: PermissionAPI
  datasource: DatasourceAPI

  constructor(config: TestConfiguration) {
    this.table = new TableAPI(config)
    this.viewV2 = new ViewV2API(config)
    this.row = new RowAPI(config)
    this.permission = new PermissionAPI(config)
    this.datasource = new DatasourceAPI(config)
  }
}
