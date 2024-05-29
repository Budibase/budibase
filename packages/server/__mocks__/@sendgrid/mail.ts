// eslint-disable-next-line @typescript-eslint/no-unused-vars
module SendgridMock {
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
      if (msg.to === "invalid@example.com") {
        throw "Invalid"
      }
      return msg
    }
  }

  module.exports = new Email()
}
