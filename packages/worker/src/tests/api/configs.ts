import TestConfiguration from "../TestConfiguration"
import { TestAPI } from "./base"

export class ConfigAPI extends TestAPI {
  constructor(config: TestConfiguration) {
    super(config)
  }

  getConfigChecklist = () => {
    return this.request
      .get(`/api/global/configs/checklist`)
      .set(this.config.defaultHeaders())
      .expect(200)
      .expect("Content-Type", /json/)
  }

  getPublicSettings = () => {
    return this.request
      .get(`/api/global/configs/public`)
      .set(this.config.defaultHeaders())
      .expect(200)
      .expect("Content-Type", /json/)
  }

  saveConfig = (data: any) => {
    return this.request
      .post(`/api/global/configs`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect(200)
      .expect("Content-Type", /json/)
  }

  OIDCCallback = (configId: string, preAuthRes: any) => {
    const cookie = this.config.cookieHeader(preAuthRes.get("set-cookie"))
    const setKoaSession = cookie.Cookie.find((c: string) =>
      c.includes("koa:sess")
    )
    const koaSession = setKoaSession.split("=")[1] + "=="
    const sessionContent = JSON.parse(
      Buffer.from(koaSession, "base64").toString("utf-8")
    )
    const handle = sessionContent["openidconnect:localhost"].state.handle
    return this.request
      .get(`/api/global/auth/${this.config.getTenantId()}/oidc/callback`)
      .query({ code: "test", state: handle })
      .set(cookie)
  }

  getOIDCConfig = (configId: string) => {
    return this.request.get(
      `/api/global/auth/${this.config.getTenantId()}/oidc/configs/${configId}`
    )
  }
}
