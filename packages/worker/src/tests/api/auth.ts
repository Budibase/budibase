import TestConfiguration from "../TestConfiguration"

export class AuthAPI {
  config: TestConfiguration
  request: any

  constructor(config: TestConfiguration) {
    this.config = config
    this.request = config.request
  }

  updatePassword = (code: string) => {
    return this.request
      .post(`/api/global/auth/${this.config.getTenantId()}/reset/update`)
      .send({
        password: "newpassword",
        resetCode: code,
      })
      .expect("Content-Type", /json/)
      .expect(200)
  }

  logout = () => {
    return this.request
      .post("/api/global/auth/logout")
      .set(this.config.defaultHeaders())
      .expect(200)
  }

  requestPasswordReset = async (sendMailMock: any) => {
    await this.config.saveSmtpConfig()
    await this.config.saveSettingsConfig()
    await this.config.createUser()
    const res = await this.request
      .post(`/api/global/auth/${this.config.getTenantId()}/reset`)
      .send({
        email: "test@test.com",
      })
      .expect("Content-Type", /json/)
      .expect(200)
    const emailCall = sendMailMock.mock.calls[0][0]
    const parts = emailCall.html.split(
      `http://localhost:10000/builder/auth/reset?code=`
    )
    const code = parts[1].split('"')[0].split("&")[0]
    return { code, res }
  }
}
