import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class EmailAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  sendEmail = (purpose: string) => {
    return this.request
      .post(`/api/global/email/send`)
      .send({
        email: "test@test.com",
        purpose,
        tenantId: this.config.getTenantId(),
      })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
