import { TestAPI, TestAPIOpts } from "./base"

export class AuthAPI extends TestAPI {
  updatePassword = (
    resetCode: string,
    password: string,
    opts?: TestAPIOpts
  ) => {
    return this.request
      .post(`/api/global/auth/${this.config.getTenantId()}/reset/update`)
      .send({
        password,
        resetCode,
      })
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }

  login = (
    tenantId: string,
    email: string,
    password: string,
    opts?: TestAPIOpts
  ) => {
    return this.request
      .post(`/api/global/auth/${tenantId}/login`)
      .send({
        username: email,
        password: password,
      })
      .expect(opts?.status ? opts.status : 200)
  }

  logout = () => {
    return this.request
      .post("/api/global/auth/logout")
      .set(this.config.defaultHeaders())
      .expect(200)
  }

  requestPasswordReset = async (
    sendMailMock: any,
    email: string,
    opts?: TestAPIOpts
  ) => {
    await this.config.saveSmtpConfig()
    await this.config.saveSettingsConfig()

    const res = await this.request
      .post(`/api/global/auth/${this.config.getTenantId()}/reset`)
      .send({
        email: email,
      })
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)

    let code: string | undefined
    if (res.status === 200) {
      if (sendMailMock.mock.calls.length) {
        const emailCall = sendMailMock.mock.calls[0][0]
        const parts = emailCall.html.split(
          `http://localhost:10000/builder/auth/reset?code=`
        )
        code = parts[1].split('"')[0].split("&")[0]
      }
    }

    return { code, res }
  }
}
