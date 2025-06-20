import { BaseAPIClient } from "./types"
import { VerifyRecaptchaRequest, VerifyRecaptchaResponse } from "@budibase/types"

export interface RecaptchaEndpoints {
  verify: (token: string) => Promise<VerifyRecaptchaResponse>
}

export const buildRecaptchaEndpoints = (
  API: BaseAPIClient
): RecaptchaEndpoints => ({
  verify: async (token: string) => {
    return await API.post<VerifyRecaptchaRequest, VerifyRecaptchaResponse>({
      url: "/api/recaptcha/verify",
      body: {
        token,
      }
    })
  }
})