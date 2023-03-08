import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class LicenseAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  activate = async (licenseKey: string) => {
    return this.request
      .post("/api/global/license/activate")
      .send({ licenseKey: licenseKey })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
