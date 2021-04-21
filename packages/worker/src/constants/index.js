exports.UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
}

exports.Groups = {
  ALL_USERS: "all_users",
}

exports.TemplateTypes = {
  EMAIL: "email",
}

exports.TemplatePurpose = {
  PASSWORD_RECOVERY: "password_recovery",
  INVITATION: "invitation",
  CUSTOM: "custom",
}

exports.TemplatePurposePretty = [
  {
    name: "Password Recovery",
    value: exports.TemplatePurpose.PASSWORD_RECOVERY
  },
  {
    name: "New User Invitation",
    value: exports.TemplatePurpose.INVITATION,
  },
  {
    name: "Custom",
    value: exports.TemplatePurpose.CUSTOM,
  }
]

