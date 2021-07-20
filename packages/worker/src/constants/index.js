const { Configs } = require("@budibase/auth").constants

exports.LOGO_URL =
  "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg"

exports.UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
}

exports.Groups = {
  ALL_USERS: "all_users",
}

exports.Configs = Configs

exports.ConfigUploads = {
  LOGO: "logo",
  OIDC_LOGO: "oidc_logo",
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

const InternalTemplateBindings = {
  PLATFORM_URL: "platformUrl",
  COMPANY: "company",
  LOGO_URL: "logoUrl",
  EMAIL: "email",
  USER: "user",
  REQUEST: "request",
  DOCS_URL: "docsUrl",
  LOGIN_URL: "loginUrl",
  CURRENT_YEAR: "currentYear",
  CURRENT_DATE: "currentDate",
  BODY: "body",
  STYLES: "styles",
  RESET_URL: "resetUrl",
  RESET_CODE: "resetCode",
  INVITE_URL: "inviteUrl",
  INVITE_CODE: "inviteUrl",
  CONTENTS: "contents",
}

const TemplateBindings = {
  PLATFORM_URL: {
    name: InternalTemplateBindings.PLATFORM_URL,
    description: "The URL used to access the budibase platform",
  },
  COMPANY: {
    name: InternalTemplateBindings.COMPANY,
    description: "The name of your organization",
  },
  LOGO_URL: {
    name: InternalTemplateBindings.LOGO_URL,
    description: "The URL of your organizations logo.",
  },
  EMAIL: {
    name: InternalTemplateBindings.EMAIL,
    description: "The recipients email address.",
  },
  USER: {
    name: InternalTemplateBindings.USER,
    description: "The recipients user object.",
  },
  REQUEST: {
    name: InternalTemplateBindings.REQUEST,
    description: "Additional request metadata.",
  },
  DOCS_URL: {
    name: InternalTemplateBindings.DOCS_URL,
    description: "Organization documentation URL.",
  },
  LOGIN_URL: {
    name: InternalTemplateBindings.LOGIN_URL,
    description: "The URL used to log into the organization budibase instance.",
  },
  CURRENT_YEAR: {
    name: InternalTemplateBindings.CURRENT_YEAR,
    description: "The current year.",
  },
  CURRENT_DATE: {
    name: InternalTemplateBindings.CURRENT_DATE,
    description: "The current date.",
  },
}

const TemplateMetadata = {
  [TemplateTypes.EMAIL]: [
    {
      name: "Base format",
      description:
        "This is the base template, all others are based on it. The {{ body }} will be replaced with another email template.",
      category: "miscellaneous",
      purpose: EmailTemplatePurpose.BASE,
      bindings: [
        {
          name: InternalTemplateBindings.BODY,
          description: "The main body of another email template.",
        },
        {
          name: InternalTemplateBindings.STYLES,
          description: "The contents of the Styling email template.",
        },
      ],
    },
    {
      name: "Password recovery",
      description:
        "When a user requests a password reset they will receive an email built with this template.",
      category: "user management",
      purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      bindings: [
        {
          name: InternalTemplateBindings.RESET_URL,
          description:
            "The URL the recipient must click to reset their password.",
        },
        {
          name: InternalTemplateBindings.RESET_CODE,
          description:
            "The temporary password reset code used in the recipients password reset URL.",
        },
      ],
    },
    {
      name: "User welcome",
      description:
        "When a new user is added they will be sent a welcome email using this template.",
      category: "user management",
      purpose: EmailTemplatePurpose.WELCOME,
      bindings: [],
    },
    {
      name: "User invitation",
      description:
        "When inviting a user via the email on-boarding this template will be used.",
      category: "user management",
      purpose: EmailTemplatePurpose.INVITATION,
      bindings: [
        {
          name: InternalTemplateBindings.INVITE_URL,
          description:
            "The URL the recipient must click to accept the invitation and activate their account.",
        },
        {
          name: InternalTemplateBindings.INVITE_CODE,
          description:
            "The temporary invite code used in the recipients invitation URL.",
        },
      ],
    },
    {
      name: "Custom",
      description:
        "A custom template, this is currently used for SMTP email actions in automations.",
      category: "automations",
      purpose: EmailTemplatePurpose.CUSTOM,
      bindings: [
        {
          name: InternalTemplateBindings.CONTENTS,
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
exports.InternalTemplateBindings = InternalTemplateBindings
exports.GLOBAL_OWNER = "global"
