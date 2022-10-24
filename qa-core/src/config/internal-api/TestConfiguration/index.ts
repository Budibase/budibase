import ApplicationApi from "./applications"
import AuthApi from "./auth"
import InternalAPIClient from "./InternalAPIClient"
import ScreenApi from "./screens"

export default class TestConfiguration<T> {
  applications: ApplicationApi
  auth: AuthApi
  screen: ScreenApi
  context: T

  constructor(apiClient: InternalAPIClient) {
    this.applications = new ApplicationApi(apiClient)
    this.auth = new AuthApi(apiClient)
    this.screen = new ScreenApi(apiClient)
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
