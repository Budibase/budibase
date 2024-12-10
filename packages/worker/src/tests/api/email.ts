import { EmailAttachment } from "@budibase/types"
import { TestAPI } from "./base"

export class EmailAPI extends TestAPI {
  sendEmail = (purpose: string, attachments?: EmailAttachment[]) => {
    return this.request
      .post(`/api/global/email/send`)
      .send({
        email: "test@example.com",
        attachments,
        purpose,
        tenantId: this.config.getTenantId(),
        userId: this.config.user!._id!,
      })
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(200)
  }
}
