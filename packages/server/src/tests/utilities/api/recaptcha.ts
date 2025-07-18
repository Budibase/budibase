import { VerifyRecaptchaRequest } from "@budibase/types"
import { Expectations, RequestOpts, TestAPI } from "./base"
import { Response } from "supertest"

export class RecaptchaAPI extends TestAPI {
  verify = async (
    request: Partial<VerifyRecaptchaRequest>,
    expectations?: Expectations
  ): Promise<Response> => {
    return await this._requestRaw("post", "/api/recaptcha/verify", {
      body: request,
      expectations,
    })
  }

  check = async (
    cookie?: string,
    expectations?: Expectations
  ): Promise<Response> => {
    const opts: RequestOpts = {
      expectations,
    }
    if (cookie) {
      opts.headers = {
        cookie,
      }
    }
    return await this._requestRaw("get", "/api/recaptcha/check", opts)
  }
}
