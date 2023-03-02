import PublicAPIClient from "./PublicAPIClient"
import ApplicationApi from "./applications"
import TableApi from "./tables"
import UserApi from "./users"
import RowApi from "./rows"
import AuthApi from "./auth"
import AccountsApiClient from "./accountsAPIClient"
import AccountsApi from "./accounts"
import { generateAccount } from "../fixtures/accounts"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  users: UserApi
  tables: TableApi
  rows: RowApi
  context: T
  accounts: AccountsApi
  apiClient: PublicAPIClient
  accountsApiClient: AccountsApiClient

  constructor(
    apiClient: PublicAPIClient,
    accountsApiClient: AccountsApiClient
  ) {
    this.apiClient = apiClient
    this.accountsApiClient = accountsApiClient

    this.auth = new AuthApi(this.accountsApiClient)
    this.accounts = new AccountsApi(this.accountsApiClient)
    this.applications = new ApplicationApi(apiClient)
    this.users = new UserApi(apiClient)
    this.tables = new TableApi(apiClient)
    this.rows = new RowApi(apiClient)
    this.context = <T>{}
  }

  async setupAccountAndTenant() {
    const account = generateAccount()
    await this.accounts.validateEmail(<string>account.email)
    await this.accounts.validateTenantId(<string>account.tenantId)
    process.env.TENANT_ID = <string>account.tenantId
    await this.accounts.create(account)
    await this.updateApiClients(<string>account.tenantName)
    await this.auth.login(<string>account.email, <string>account.password)
    await this.applications.createFirstApp()
  }

  async setApiKey() {
    const apiKeyResponse = await this.auth.getApiKey()
    this.apiClient.setApiKey(apiKeyResponse.apiKey)
  }
  async updateApiClients(tenantName: string) {
    this.apiClient.setTenantName(tenantName)
    this.applications = new ApplicationApi(this.apiClient)
    this.rows = new RowApi(this.apiClient)

    this.context = <T>{}
  }

  async beforeAll() {}

  async afterAll() {
    this.context = <T>{}
  }
}
