import { vi } from "vitest"

class Email {
  constructor() {
    // @ts-ignore
    this.apiKey = null
  }

  setApiKey(apiKey: any) {
    // @ts-ignore
    this.apiKey = apiKey
  }

  async send(msg: any) {
    if (msg.to === "invalid@test.com") {
      throw "Invalid"
    }
    return msg
  }
}

vi.mock("@sendgrid/mail", () => {
  return new Email()
})
