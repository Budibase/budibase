export interface VerifyRecaptchaRequest {
  token: string
}
export interface VerifyRecaptchaResponse {
  verified: boolean
}

export interface CheckRecaptchaResponse {
  verified: boolean
}

export type RecaptchaSessionCookie = { sessionId: string }
