import {
  VerifyRecaptchaRequest,
  VerifyRecaptchaResponse,
  CheckRecaptchaResponse,
} from "@budibase/types"
import { Expectations, TestAPI } from "./base"
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
    expectations?: Expectations
  ): Promise<Response> => {
    return await this._requestRaw("get", "/api/recaptcha/check", {
      expectations,
    })
  }
}