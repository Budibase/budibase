import { App } from "@budibase/types"
import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class ApplicationAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  get = async (appId: string): Promise<App> => {
    const result = await this.request
      .get(`/api/applications/${appId}/appPackage`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return result.body.application as App
  }
}
