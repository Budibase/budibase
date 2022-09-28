import TestConfiguration from "../TestConfiguration"

export class EmailAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
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
