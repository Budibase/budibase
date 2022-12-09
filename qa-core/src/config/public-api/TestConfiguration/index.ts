import PublicAPIClient from "./PublicAPIClient"
import ApplicationApi from "./applications"
import TableApi from "./tables"
import UserApi from "./users"
import RowApi from "./rows"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  users: UserApi
  tables: TableApi
  rows: RowApi
  context: T

  constructor(apiClient: PublicAPIClient) {
    this.applications = new ApplicationApi(apiClient)
    this.users = new UserApi(apiClient)
    this.tables = new TableApi(apiClient)
    this.rows = new RowApi(apiClient)
    this.context = <T>{}
  }

  async beforeAll() {}

  async afterAll() {
    this.context = <T>{}
  }
}
