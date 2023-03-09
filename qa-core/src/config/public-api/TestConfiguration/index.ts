import PublicAPIClient from "./PublicAPIClient"
import ApplicationApi from "./applications"
import TableApi from "./tables"
import UserApi from "./users"
import RowApi from "./rows"
import AuthApi from "./auth"
import AccountsApiClient from "./accountsAPIClient"
import AccountsApi from "./accounts"
import { generateAccount } from "../fixtures/accounts"
import internalApplicationsApi from "../../internal-api/TestConfiguration/applications"

import InternalAPIClient from "../../internal-api/TestConfiguration/InternalAPIClient"

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
  internalApiClient: InternalAPIClient
  internalApplicationsApi: internalApplicationsApi

  constructor(
    apiClient: PublicAPIClient,
    accountsApiClient: AccountsApiClient,
    internalApiClient: InternalAPIClient
  ) {
    this.apiClient = apiClient
    this.accountsApiClient = accountsApiClient
    this.internalApiClient = internalApiClient

    this.auth = new AuthApi(this.internalApiClient)
    this.accounts = new AccountsApi(this.accountsApiClient)
    this.applications = new ApplicationApi(apiClient)
    this.users = new UserApi(apiClient)
    this.tables = new TableApi(apiClient)
    this.rows = new RowApi(apiClient)
    this.internalApplicationsApi = new internalApplicationsApi(
      internalApiClient
    )

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
    const body = {
      name: "My first app",
      url: "my-first-app",
      useTemplate: false,
      sampleData: true,
    }
    await this.internalApplicationsApi.create(body)
  }

  async setApiKey() {
    const apiKeyResponse = await this.auth.getApiKey()
    this.apiClient.setApiKey(apiKeyResponse.apiKey)
  }
  async updateApiClients(tenantName: string) {
    this.apiClient.setTenantName(tenantName)
    this.applications = new ApplicationApi(this.apiClient)
    this.rows = new RowApi(this.apiClient)
    this.internalApiClient.setTenantName(tenantName)
    this.internalApplicationsApi = new internalApplicationsApi(
      this.internalApiClient
    )
    this.auth = new AuthApi(this.internalApiClient)
    this.context = <T>{}
  }

  async beforeAll() {}

  async afterAll() {
    this.context = <T>{}
  }
}
