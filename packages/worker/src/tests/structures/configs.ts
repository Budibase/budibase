import { utils } from "@budibase/backend-core"
import {
  SettingsConfig,
  ConfigType,
  SMTPConfig,
  GoogleConfig,
  OIDCConfig,
  AIConfig,
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

export function ai(): AIConfig {
  return {
    type: ConfigType.AI,
    config: {
      ai: {
        provider: "OpenAI",
        isDefault: false,
        name: "Test",
        active: true,
        defaultModel: "gpt4",
        apiKey: "myapikey",
        baseUrl: "https://api.example.com",
      },
    },
  }
}
