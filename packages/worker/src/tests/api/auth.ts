import type { SetInitInfoRequest } from "@budibase/types"
import { TestAPI, type TestAPIOpts } from "./base"

export class AuthAPI extends TestAPI {
  private initCookie = ""

  setRawInitInfo = async ({
    body,
    opts,
  }: {
    body: object
    opts?: TestAPIOpts
  }) => {
    const response = await this.request
      .post("/api/global/auth/init")
      .send(body)
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
    const cookies = response.headers["set-cookie"]
    if (cookies) {
      this.initCookie = (Array.isArray(cookies) ? cookies : [cookies])
        .map(cookie => cookie.split(";")[0])
        .join("; ")
    }
    return response
  }

  setInitInfo = async ({
    body,
    opts,
  }: {
    body: SetInitInfoRequest
    opts?: TestAPIOpts
  }) => {
    return await this.setRawInitInfo({ body, opts })
  }

  getInitInfo = (opts?: TestAPIOpts) => {
    return this.getInitInfoWithCookie({ cookie: this.initCookie, opts })
  }

  getInitInfoWithCookie = ({
    cookie,
    opts,
  }: {
    cookie: string
    opts?: TestAPIOpts
  }) => {
    const headers = this.config.defaultHeaders()
    return this.request
      .get("/api/global/auth/init")
      .set(headers)
      .set("Cookie", [headers.Cookie, cookie].filter(Boolean).join("; "))
      .expect("Content-Type", /json/)
      .expect(opts?.status ? opts.status : 200)
  }

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
