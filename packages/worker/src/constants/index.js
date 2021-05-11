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

exports.ConfigUploads = {
  LOGO: "logo",
}

const TemplateTypes = {
  EMAIL: "email",
}

const EmailTemplatePurpose = {
  BASE: "base",
  PASSWORD_RECOVERY: "password_recovery",
  INVITATION: "invitation",
  WELCOME: "welcome",
  CUSTOM: "custom",
}

const TemplateBindings = {
  PLATFORM_URL: {
    name: "platformUrl",
    description: "The URL used to access the budibase platform",
  },
  COMPANY: {
    name: "company",
    description: "The name of your organization",
  },
  LOGO_URL: {
    name: "logoUrl",
    description: "The URL of your organizations logo.",
  },
  EMAIL: {
    name: "email",
    description: "The recipients email address.",
  },
  USER: {
    name: "user",
    description: "The recipients user object.",
  },
  REQUEST: {
    name: "request",
    description: "Additional request metadata.",
  },
  DOCS_URL: {
    name: "docsUrl",
    description: "Organization documentation URL.",
  },
  LOGIN_URL: {
    name: "loginUrl",
    description: "The URL used to log into the organization budibase instance.",
  },
  CURRENT_YEAR: {
    name: "currentYear",
    description: "The current year.",
  },
  CURRENT_DATE: {
    name: "currentDate",
    description: "The current date.",
  },
}

const TemplateMetadata = {
  [TemplateTypes.EMAIL]: [
    {
      name: "Base Format",
      purpose: EmailTemplatePurpose.BASE,
      bindings: [
        {
          name: "body",
          description: "The main body of another email template.",
        },
        {
          name: "styles",
          description: "The contents of the Styling email template.",
        },
      ],
    },
    {
      name: "Password Recovery",
      purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      bindings: [
        {
          name: "resetUrl",
          description:
            "The URL the recipient must click to reset their password.",
        },
        {
          name: "resetCode",
          description:
            "The temporary password reset code used in the recipients password reset URL.",
        },
      ],
    },
    {
      name: "New User Invitation",
      purpose: EmailTemplatePurpose.INVITATION,
      bindings: [
        {
          name: "inviteUrl",
          description:
            "The URL the recipient must click to accept the invitation and activate their account.",
        },
        {
          name: "inviteCode",
          description:
            "The temporary invite code used in the recipients invitation URL.",
        },
      ],
    },
    {
      name: "Custom",
      purpose: EmailTemplatePurpose.CUSTOM,
      bindings: [
        {
          name: "contents",
          description: "Custom content body.",
        },
      ],
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
exports.GLOBAL_OWNER = "global"
