import { utils } from "@budibase/backend-core"
import {
  SMTPConfig,
  OIDCConfig,
  GoogleConfig,
  SettingsConfig,
  ConfigType,
} from "@budibase/types"

export const oidc = (conf?: OIDCConfig): OIDCConfig => {
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

export const google = (conf?: GoogleConfig): GoogleConfig => {
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

export const smtp = (conf?: SMTPConfig): SMTPConfig => {
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

export const settings = (conf?: SettingsConfig): SettingsConfig => {
  return {
    type: ConfigType.SETTINGS,
    config: {
      platformUrl: "http://mycustomdomain.com",
      logoUrl: "http://mylogourl,com",
      company: "mycompany",
      ...conf,
    },
  }
}
