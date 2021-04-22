exports.LOGO_URL =
  "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg"

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
  BASE: "base",
  STYLES: "styles",
  PASSWORD_RECOVERY: "password_recovery",
  INVITATION: "invitation",
  CUSTOM: "custom",
}

const TemplateBindings = {
  URL: "url",
  COMPANY: "company",
  LOGO_URL: "logoUrl",
  STYLES: "styles",
  BODY: "body",
  REGISTRATION_URL: "registrationUrl",
  EMAIL: "email",
  RESET_URL: "resetUrl",
  USER: "user",
}

const TemplateMetadata = {
  [TemplateTypes.EMAIL]: [
    {
      name: "Styling",
      purpose: EmailTemplatePurpose.STYLES,
      bindings: ["url", "company", "companyUrl", "styles", "body"]
    },
    {
      name: "Base Format",
      purpose: EmailTemplatePurpose.BASE,
      bindings: ["company", "registrationUrl"]
    },
    {
      name: "Password Recovery",
      purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
    },
    {
      name: "New User Invitation",
      purpose: EmailTemplatePurpose.INVITATION,
    },
    {
      name: "Custom",
      purpose: EmailTemplatePurpose.CUSTOM,
    },
  ],
}

// all purpose combined
exports.TemplatePurpose = {
  ...EmailTemplatePurpose,
}
exports.TemplateTypes = TemplateTypes
exports.EmailTemplatePurpose = EmailTemplatePurpose
exports.TemplateMetadata = TemplateMetadata
exports.TemplateBindings = TemplateBindings
