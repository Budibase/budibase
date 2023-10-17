import { constants } from "@budibase/backend-core"

export const LOGO_URL =
  "https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg"

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
}

export const Config = constants.Config

export enum ConfigUpload {
  LOGO = "logo",
  OIDC_LOGO = "oidc_logo",
}

export enum TemplateType {
  EMAIL = "email",
}

export enum EmailTemplatePurpose {
  CORE = "core",
  BASE = "base",
  PASSWORD_RECOVERY = "password_recovery",
  INVITATION = "invitation",
  WELCOME = "welcome",
  CUSTOM = "custom",
}

export enum TemplateMetadataNames {
  BASE = "Base format",
  PASSWORD_RECOVERY = "Password recovery",
  WELCOME = "User welcome",
  INVITATION = "User invitation",
  CUSTOM = "Custom",
}

export enum InternalTemplateBinding {
  PLATFORM_URL = "platformUrl",
  COMPANY = "company",
  LOGO_URL = "logoUrl",
  EMAIL = "email",
  USER = "user",
  REQUEST = "request",
  DOCS_URL = "docsUrl",
  LOGIN_URL = "loginUrl",
  CURRENT_YEAR = "currentYear",
  CURRENT_DATE = "currentDate",
  BODY = "body",
  STYLES = "styles",
  RESET_URL = "resetUrl",
  RESET_CODE = "resetCode",
  INVITE_URL = "inviteUrl",
  INVITE_CODE = "inviteUrl",
  CONTENTS = "contents",
}

export const TemplateBindings = {
  PLATFORM_URL: {
    name: InternalTemplateBinding.PLATFORM_URL,
    description: "The URL used to access the budibase platform",
  },
  COMPANY: {
    name: InternalTemplateBinding.COMPANY,
    description: "The name of your organization",
  },
  LOGO_URL: {
    name: InternalTemplateBinding.LOGO_URL,
    description: "The URL of your organizations logo.",
  },
  EMAIL: {
    name: InternalTemplateBinding.EMAIL,
    description: "The recipients email address.",
  },
  USER: {
    name: InternalTemplateBinding.USER,
    description: "The recipients user object.",
  },
  REQUEST: {
    name: InternalTemplateBinding.REQUEST,
    description: "Additional request metadata.",
  },
  DOCS_URL: {
    name: InternalTemplateBinding.DOCS_URL,
    description: "Organization documentation URL.",
  },
  LOGIN_URL: {
    name: InternalTemplateBinding.LOGIN_URL,
    description: "The URL used to log into the organization budibase instance.",
  },
  CURRENT_YEAR: {
    name: InternalTemplateBinding.CURRENT_YEAR,
    description: "The current year.",
  },
  CURRENT_DATE: {
    name: InternalTemplateBinding.CURRENT_DATE,
    description: "The current date.",
  },
}

export const TemplateMetadata = {
  [TemplateType.EMAIL]: [
    {
      name: TemplateMetadataNames.BASE,
      description:
        "This is the base template, all others are based on it. The {{ body }} will be replaced with another email template.",
      category: "miscellaneous",
      purpose: EmailTemplatePurpose.BASE,
      bindings: [
        {
          name: InternalTemplateBinding.BODY,
          description: "The main body of another email template.",
        },
        {
          name: InternalTemplateBinding.STYLES,
          description: "The contents of the Styling email template.",
        },
      ],
    },
    {
      name: TemplateMetadataNames.PASSWORD_RECOVERY,
      description:
        "When a user requests a password reset they will receive an email built with this template.",
      category: "user management",
      purpose: EmailTemplatePurpose.PASSWORD_RECOVERY,
      bindings: [
        {
          name: InternalTemplateBinding.RESET_URL,
          description:
            "The URL the recipient must click to reset their password.",
        },
        {
          name: InternalTemplateBinding.RESET_CODE,
          description:
            "The temporary password reset code used in the recipients password reset URL.",
        },
      ],
    },
    {
      name: TemplateMetadataNames.WELCOME,
      description:
        "When a new user is added they will be sent a welcome email using this template.",
      category: "user management",
      purpose: EmailTemplatePurpose.WELCOME,
      bindings: [],
    },
    {
      name: TemplateMetadataNames.INVITATION,
      description:
        "When inviting a user via the email on-boarding this template will be used.",
      category: "user management",
      purpose: EmailTemplatePurpose.INVITATION,
      bindings: [
        {
          name: InternalTemplateBinding.INVITE_URL,
          description:
            "The URL the recipient must click to accept the invitation and activate their account.",
        },
        {
          name: InternalTemplateBinding.INVITE_CODE,
          description:
            "The temporary invite code used in the recipients invitation URL.",
        },
      ],
    },
    {
      name: TemplateMetadataNames.CUSTOM,
      description:
        "A custom template, this is currently used for SMTP email actions in automations.",
      category: "automations",
      purpose: EmailTemplatePurpose.CUSTOM,
      bindings: [
        {
          name: InternalTemplateBinding.CONTENTS,
          description: "Custom content body.",
        },
      ],
    },
  ],
}

// all purpose combined
export { EmailTemplatePurpose as TemplatePurpose }
export const GLOBAL_OWNER = "global"
