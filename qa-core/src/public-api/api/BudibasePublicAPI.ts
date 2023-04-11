import AppAPI from "./apis/AppAPI"
import UserAPI from "./apis/UserAPI"
import TableAPI from "./apis/TableAPI"
import RowAPI from "./apis/RowAPI"

import BudibasePublicAPIClient from "./BudibasePublicAPIClient"
import { State } from "../../types"

export default class BudibasePublicAPI {
  client: BudibasePublicAPIClient
  apps: AppAPI
  users: UserAPI
  tables: TableAPI
  rows: RowAPI

  constructor(state: State) {
    this.client = new BudibasePublicAPIClient(state)
    this.apps = new AppAPI(this.client)
    this.users = new UserAPI(this.client)
    this.tables = new TableAPI(this.client)
    this.rows = new RowAPI(this.client, state)
  }
}
