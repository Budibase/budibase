import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class EmailAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  sendEmail = (purpose: string, attachments?: string[]) => {
    return this.request
      .post(`/api/global/email/send`)
      .send({
        email: "test@example.com",
        attachments,
        purpose,
        tenantId: this.config.getTenantId(),
        userId: this.config.user?._id!,
      })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
