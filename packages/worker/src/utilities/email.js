const nodemailer = require("nodemailer")

exports.createSMTPTransport = (config) => {
  const options = {
    port: config.port,
    host: config.host,
    secure: config.secure || false,
    auth: config.auth,
  }
  if (config.selfSigned) {
    options.tls = {
      rejectUnauthorized: false,
    }
  }
  return nodemailer.createTransport(options)
}

exports.verifyConfig = async (config) => {
  const transport = exports.createSMTPTransport(config)
  await transport.verify()
}
