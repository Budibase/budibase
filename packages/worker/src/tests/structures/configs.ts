import { utils } from "@budibase/backend-core"
import {
  SettingsConfig,
  ConfigType,
  SMTPConfig,
  GoogleConfig,
  OIDCConfig,
} from "@budibase/types"

export function oidc(conf?: any): OIDCConfig {
  return {
    type: ConfigType.OIDC,
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

export function google(conf?: any): GoogleConfig {
  return {
    type: ConfigType.GOOGLE,
    config: {
      clientID: "clientId",
      clientSecret: "clientSecret",
      activated: true,
      ...conf,
    },
  }
}

export function smtp(conf?: any): SMTPConfig {
  return {
    type: ConfigType.SMTP,
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

export function smtpEthereal(): SMTPConfig {
  return {
    type: ConfigType.SMTP,
    config: {
      port: 587,
      host: "smtp.ethereal.email",
      from: "testfrom@test.com",
      secure: false,
      auth: {
        user: "wyatt.zulauf29@ethereal.email",
        pass: "tEwDtHBWWxusVWAPfa",
      },
      connectionTimeout: 1000, // must be less than the jest default of 5000
    },
  }
}

export function settings(conf?: any): SettingsConfig {
  return {
    type: ConfigType.SETTINGS,
    config: {
      platformUrl: "http://localhost:10000",
      logoUrl: "",
      company: "Budibase",
      ...conf,
    },
  }
}
