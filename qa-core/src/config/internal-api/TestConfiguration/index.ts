import ApplicationApi from "./applications"
import AuthApi from "./auth"
import InternalAPIClient from "./InternalAPIClient"
import AccountsApiClient from "./accountsAPIClient"
import TablesApi from "./tables"
import RowApi from "./rows"
import ScreenApi from "./screens"
import UserManagementApi from "./userManagement"
import AccountsApi from "./accounts"
import { generateAccount } from "../fixtures/accounts"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  screen: ScreenApi
  context: T
  tables: TablesApi
  rows: RowApi
  users: UserManagementApi
  accounts: AccountsApi
  apiClient: InternalAPIClient
  accountsApiClient: AccountsApiClient

  constructor(
    apiClient: InternalAPIClient,
    accountsApiClient: AccountsApiClient
  ) {
    this.apiClient = apiClient
    this.accountsApiClient = accountsApiClient

    this.applications = new ApplicationApi(this.apiClient)
    this.tables = new TablesApi(this.apiClient)
    this.rows = new RowApi(this.apiClient)
    this.auth = new AuthApi(this.apiClient)
    this.screen = new ScreenApi(this.apiClient)
    this.users = new UserManagementApi(this.apiClient)
    this.accounts = new AccountsApi(this.accountsApiClient)
    this.context = <T>{}
  }

  async loginAsAdmin() {
    await this.auth.login(
      <string>process.env.BB_ADMIN_USER_EMAIL,
      <string>process.env.BB_ADMIN_USER_PASSWORD
    )
  }
  // TODO: add logic to setup or login based in env variables

  async setupAccountAndTenant() {
    const account = generateAccount()
    await this.accounts.validateEmail(<string>account.email)
    await this.accounts.validateTenantId(<string>account.tenantId)
    process.env.TENANT_ID = <string>account.tenantId
    await this.accounts.create(account)
    await this.updateApiClients(<string>account.tenantName)
    await this.auth.login(<string>account.email, <string>account.password)
  }

  async updateApiClients(tenantName: string) {
    this.apiClient.setTenantName(tenantName)
    this.applications = new ApplicationApi(this.apiClient)
    this.tables = new TablesApi(this.apiClient)
    this.rows = new RowApi(this.apiClient)
    this.auth = new AuthApi(this.apiClient)
    this.screen = new ScreenApi(this.apiClient)
    this.users = new UserManagementApi(this.apiClient)
    this.context = <T>{}
  }

  async login(email: string, password: string) {
    await this.auth.logout()
    await this.auth.login(email, password)
  }

  async afterAll() {
    this.context = <T>{}
    await this.auth.logout()
  }
}
