import TestConfiguration from "../TestConfiguration"
import { RowAPI } from "./row"
import { TableAPI } from "./table"
import { ViewV2API } from "./viewV2"

export default class API {
  table: TableAPI
  viewV2: ViewV2API
  row: RowAPI

  constructor(config: TestConfiguration) {
    this.table = new TableAPI(config)
    this.viewV2 = new ViewV2API(config)
    this.row = new RowAPI(config)
  }
}
