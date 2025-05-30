import {
  ConfigType,
  ConfigTypeToConfig,
  SaveConfigRequest,
  SaveConfigResponse,
} from "@budibase/types"
import { TestAPI } from "./base"

export class ConfigAPI extends TestAPI {
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

  getAIConfig = async () => {
    return await this.getConfig(ConfigType.AI)
  }

  getConfig = async <T extends ConfigType>(type: T) => {
    const resp = await this.request
      .get(`/api/global/configs/${type}`)
      .set(this.config.defaultHeaders())
      .expect(200)
      .expect("Content-Type", /json/)
    return resp.body as ConfigTypeToConfig<T>
  }

  saveConfig = async (
    data: SaveConfigRequest,
    expectations?: { status?: number; body?: Record<string, string | RegExp> }
  ) => {
    const { status = 200, body } = expectations || {}

    const resp = await this.request
      .post(`/api/global/configs`)
      .send(data)
      .set(this.config.defaultHeaders())
      .expect("Content-Type", /json/)

    if (resp.status !== status) {
      throw new Error(
        `Expected status ${status}, got ${resp.status}: ${resp.text}`
      )
    }

    if (body) {
      for (const [key, value] of Object.entries(body)) {
        if (typeof value === "string") {
          expect(resp.body[key]).toEqual(value)
        } else if (value instanceof RegExp) {
          expect(resp.body[key]).toMatch(value)
        }
      }
    }

    return resp.body as SaveConfigResponse
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
    const handle = sessionContent["openidconnect:example.com"].state.handle
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
