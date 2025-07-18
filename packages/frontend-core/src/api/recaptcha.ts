import { BaseAPIClient } from "./types"
import {
  VerifyRecaptchaRequest,
  VerifyRecaptchaResponse,
  CheckRecaptchaResponse,
} from "@budibase/types"

export interface RecaptchaEndpoints {
  verify: (token: string) => Promise<VerifyRecaptchaResponse>
  check: () => Promise<CheckRecaptchaResponse>
}

export const buildRecaptchaEndpoints = (
  API: BaseAPIClient
): RecaptchaEndpoints => ({
  verify: async (token: string) => {
    return await API.post<VerifyRecaptchaRequest, VerifyRecaptchaResponse>({
      url: "/api/recaptcha/verify",
      body: {
        token,
      },
    })
  },

  check: async () => {
    return await API.get<CheckRecaptchaResponse>({
      url: "/api/recaptcha/check",
    })
  },
})
