import { SendEmailRequest, SendEmailResponse } from "@budibase/types"
import { TestAPI } from "./base"

export class EmailAPI extends TestAPI {
  sendEmail = async (
    req: SendEmailRequest,
    expectations?: { status?: number }
  ): Promise<SendEmailResponse> => {
    const res = await this.request
      .post(`/api/global/email/send`)
      .send(req)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)
      .expect(expectations?.status || 200)

    return res.body as SendEmailResponse
  }
}
