import TestConfiguration from "../TestConfiguration"
import { TableAPI } from "./table"
import { ViewV2API } from "./viewV2"

export default class API {
  table: TableAPI
  viewV2: ViewV2API

  constructor(config: TestConfiguration) {
    this.table = new TableAPI(config)
    this.viewV2 = new ViewV2API(config)
  }
}
