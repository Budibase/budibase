import PublicAPIClient from "./PublicAPIClient";
import generateApp from "./applications/fixtures/generate"

class TestConfiguration {
  testContext: Record<string, any>;
  apiClient: PublicAPIClient;

  constructor() {
    this.testContext = {}
    this.apiClient = new PublicAPIClient()
  }

  async beforeAll() {

  }

  async afterAll() {
  }

  async seedTable(appId: string) {
    const response = await this.apiClient.post("/tables", {
      body: require("./tables/fixtures/seed.json"),
      headers: {
        "x-budibase-app-id": appId
      }
    })
    const json = await response.json()
    return json.data
  }

  async seedApp() {
    const response = await this.apiClient.post("/applications", {
      body: generateApp() 
    })
    return response.json()
  }
}

export default TestConfiguration
