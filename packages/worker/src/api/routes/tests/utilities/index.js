const TestConfig = require("./TestConfiguration")

let request, config

exports.beforeAll = () => {
  config = new TestConfig()
  request = config.getRequest()
}

exports.afterAll = async () => {
  if (config) {
    await config.end()
  }
  request = null
  config = null
}

exports.getRequest = () => {
  if (!request) {
    exports.beforeAll()
  }
  return request
}

exports.getConfig = () => {
  if (!config) {
    exports.beforeAll()
  }
  return config
}

exports.emailMock = () => {
  // mock the email system
  const sendMailMock = jest.fn()
  const nodemailer = require("nodemailer")
  nodemailer.createTransport.mockReturnValue({
    sendMail: sendMailMock,
    verify: jest.fn(),
  })
  return sendMailMock
}
