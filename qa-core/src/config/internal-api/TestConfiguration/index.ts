import ApplicationApi from "./applications"
import AuthApi from "./auth"
import InternalAPIClient from "./InternalAPIClient"
import TablesApi from "./tables"
import RowApi from "./rows"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  context: T
  tables: TablesApi
  rows: RowApi

  constructor(apiClient: InternalAPIClient) {
    this.applications = new ApplicationApi(apiClient)
    this.tables = new TablesApi(apiClient)
    this.rows = new RowApi(apiClient)
    this.auth = new AuthApi(apiClient)
    this.context = <T>{}
  }

  async beforeAll() {
    await this.auth.login()
  }

  async afterAll() {
    this.context = <T>{}
    await this.auth.logout()
  }
}
