import TestConfiguration from "../TestConfiguration"
import { Screen } from "@budibase/types"
import { TestAPI } from "./base"

export class ScreenAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  list = async (): Promise<Screen[]> => {
    const res = await this.request
      .get(`/api/screens`)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
    return res.body as Screen[]
  }
}
