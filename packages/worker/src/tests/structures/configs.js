const { Config } = require("../../constants")
const { utils } = require("@budibase/backend-core")

exports.oidc = conf => {
  return {
    type: Config.OIDC,
    config: {
      configs: [
        {
          configUrl: "http://someconfigurl",
          clientID: "clientId",
          clientSecret: "clientSecret",
          logo: "Microsoft",
          name: "Active Directory",
          uuid: utils.newid(),
          activated: true,
          ...conf,
        },
      ],
    },
  }
}

exports.google = conf => {
  return {
    type: Config.GOOGLE,
    config: {
      clientID: "clientId",
      clientSecret: "clientSecret",
      activated: true,
      ...conf,
    },
  }
}

exports.smtp = conf => {
  return {
    type: Config.SMTP,
    config: {
      port: 12345,
      host: "smtptesthost.com",
      from: "testfrom@test.com",
      subject: "Hello!",
      secure: false,
      ...conf,
    },
  }
}

exports.smtpEthereal = () => {
  return {
    type: Config.SMTP,
    config: {
      port: 587,
      host: "smtp.ethereal.email",
      secure: false,
      auth: {
        user: "don.bahringer@ethereal.email",
        pass: "yCKSH8rWyUPbnhGYk9",
      },
      connectionTimeout: 1000, // must be less than the jest default of 5000
    },
  }
}

exports.settings = conf => {
  return {
    type: Config.SETTINGS,
    config: {
      platformUrl: "http://localhost:10000",
      logoUrl: "",
      company: "Budibase",
      ...conf,
    },
  }
}
