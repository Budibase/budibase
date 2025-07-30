import {
  VerifyRecaptchaRequest,
  VerifyRecaptchaResponse,
  CheckRecaptchaResponse,
} from "@budibase/types"
import { Expectations, RequestOpts, TestAPI } from "./base"

export class RecaptchaAPI extends TestAPI {
  verify = async (
    request: Partial<VerifyRecaptchaRequest>,
    expectations?: Expectations
  ): Promise<{
    body: VerifyRecaptchaResponse
    headers: Record<string, string>
  }> => {
    const res = await this._requestRaw("post", "/api/recaptcha/verify", {
      body: request,
      expectations,
    })
    return { body: res.body, headers: res.headers }
  }

  check = async (
    cookie?: string,
    expectations?: Expectations
  ): Promise<CheckRecaptchaResponse> => {
    const opts: RequestOpts = {
      expectations,
    }
    if (cookie) {
      opts.headers = {
        cookie,
      }
    }
    return await this._get("/api/recaptcha/check", opts)
  }
}
