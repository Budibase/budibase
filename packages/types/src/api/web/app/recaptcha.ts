export interface VerifyRecaptchaRequest {
  token: string
}
export interface VerifyRecaptchaResponse {
  verified: boolean
}

export interface CheckRecaptchaResponse {
  verified: boolean
}