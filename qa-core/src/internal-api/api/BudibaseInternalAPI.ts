import AppAPI from "./apis/AppAPI"
import AuthAPI from "./apis/AuthAPI"
import EnvironmentAPI from "./apis/EnvironmentAPI"
import RoleAPI from "./apis/RoleAPI"
import RowAPI from "./apis/RowAPI"
import ScreenAPI from "./apis/ScreenAPI"
import SelfAPI from "./apis/SelfAPI"
import TableAPI from "./apis/TableAPI"
import UserAPI from "./apis/UserAPI"
import BudibaseInternalAPIClient from "./BudibaseInternalAPIClient"
import { State } from "../../types"

export default class BudibaseInternalAPI {
  client: BudibaseInternalAPIClient

  apps: AppAPI
  auth: AuthAPI
  environment: EnvironmentAPI
  roles: RoleAPI
  rows: RowAPI
  screens: ScreenAPI
  self: SelfAPI
  tables: TableAPI
  users: UserAPI

  constructor(state: State) {
    this.client = new BudibaseInternalAPIClient(state)

    this.apps = new AppAPI(this.client)
    this.auth = new AuthAPI(this.client, state)
    this.environment = new EnvironmentAPI(this.client)
    this.roles = new RoleAPI(this.client)
    this.rows = new RowAPI(this.client)
    this.screens = new ScreenAPI(this.client)
    this.self = new SelfAPI(this.client)
    this.tables = new TableAPI(this.client)
    this.users = new UserAPI(this.client)
  }
}
