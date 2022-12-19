import ApplicationApi from "./applications"
import AuthApi from "./auth"
import InternalAPIClient from "./InternalAPIClient"
import TablesApi from "./tables"
import RowApi from "./rows"
import ScreenApi from "./screens"
import UserManagementApi from "./userManagement"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  screen: ScreenApi
  context: T
  tables: TablesApi
  rows: RowApi
  users: UserManagementApi

  constructor(apiClient: InternalAPIClient) {
    this.applications = new ApplicationApi(apiClient)
    this.tables = new TablesApi(apiClient)
    this.rows = new RowApi(apiClient)
    this.auth = new AuthApi(apiClient)
    this.screen = new ScreenApi(apiClient)
    this.users = new UserManagementApi(apiClient)
    this.context = <T>{}
  }

  async loginAsAdmin() {
    await this.auth.login(<string>process.env.BB_ADMIN_USER_EMAIL, <string>process.env.BB_ADMIN_USER_PASSWORD)
  }

  async login(email: string, password: string) {
    await this.auth.login(email, password)
  }

  async afterAll() {
    this.context = <T>{}
    await this.auth.logout()
  }
}
