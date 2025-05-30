import { utils } from "@budibase/backend-core"
import {
  SettingsConfig,
  ConfigType,
  SMTPConfig,
  GoogleConfig,
  OIDCConfig,
  GoogleInnerConfig,
  OIDCInnerConfig,
  SMTPInnerConfig,
  SettingsInnerConfig,
} from "@budibase/types"

export function oidc(conf?: Partial<OIDCInnerConfig>): OIDCConfig {
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
          scopes: [],
          ...conf,
        },
      ],
    },
  }
}

export function google(conf?: Partial<GoogleInnerConfig>): GoogleConfig {
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

export function smtp(conf?: Partial<SMTPInnerConfig>): SMTPConfig {
  return {
    type: ConfigType.SMTP,
    config: {
      port: 12345,
      host: "smtptesthost.com",
      from: "testfrom@example.com",
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
      from: "testfrom@example.com",
      secure: false,
      auth: {
        user: "mortimer.leuschke@ethereal.email",
        pass: "5hSjsPbzRv7gEUsfzx",
      },
      connectionTimeout: 1000, // must be less than the jest default of 5000
    },
  }
}

export function settings(conf?: Partial<SettingsInnerConfig>): SettingsConfig {
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
