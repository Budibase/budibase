exports.UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
}

exports.Groups = {
  ALL_USERS: "all_users",
}

exports.Configs = {
  SETTINGS: "settings",
  ACCOUNT: "account",
  SMTP: "smtp",
  GOOGLE: "google",
}

const TemplateTypes = {
  EMAIL: "email",
}

const EmailTemplatePurpose = {
  HEADER: "header",
  FOOTER: "footer",
  STYLES: "styles",
  PASSWORD_RECOVERY: "password_recovery",
  INVITATION: "invitation",
  CUSTOM: "custom",
}

const TemplatePurposePretty = {
  [TemplateTypes.EMAIL]: [
    {
      name: "Styling",
      value: EmailTemplatePurpose.STYLES,
    },
    {
      name: "Header",
      value: EmailTemplatePurpose.HEADER,
    },
    {
      name: "Footer",
      value: EmailTemplatePurpose.FOOTER,
    },
    {
      name: "Password Recovery",
      value: EmailTemplatePurpose.PASSWORD_RECOVERY
    },
    {
      name: "New User Invitation",
      value: EmailTemplatePurpose.INVITATION,
    },
    {
      name: "Custom",
      value: EmailTemplatePurpose.CUSTOM,
    }
  ]
}

// all purpose combined
exports.TemplatePurpose = {
  ...EmailTemplatePurpose,
}
exports.TemplateTypes = TemplateTypes
exports.EmailTemplatePurpose = EmailTemplatePurpose
exports.TemplatePurposePretty = TemplatePurposePretty
