import ApplicationApi from "./applications"
import AuthApi from "./auth"
import InternalAPIClient from "./InternalAPIClient"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  context: T

  constructor(apiClient: InternalAPIClient) {
    this.applications = new ApplicationApi(apiClient)
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
