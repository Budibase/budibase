export const TableNames = {
  USERS: "ta_users",
}

export const FrontendTypes = {
  PAGE: "page",
  SCREEN: "screen",
  LAYOUT: "layout",
  NONE: "none",
}

// fields on the user table that cannot be edited
export const UNEDITABLE_USER_FIELDS = ["username", "password", "roleId"]

export const LAYOUT_NAMES = {
  MASTER: {
    PRIVATE: "layout_private_master",
    PUBLIC: "layout_private_master",
  },
}
