class Email {
  constructor() {
    this.apiKey = null
  }

  setApiKey(apiKey) {
    this.apiKey = apiKey
  }

  async send(msg) {
    if (msg.to === "invalid@test.com") {
      throw "Invalid"
    }
    return msg
  }
}

module.exports = new Email()
