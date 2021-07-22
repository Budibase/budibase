export const TableNames = {
  USERS: "ta_users",
}

export const FrontendTypes = {
  PAGE: "page",
  SCREEN: "screen",
  LAYOUT: "layout",
  NONE: "none",
}

export const AppStatus = {
  ALL: "all",
  DEV: "development",
  DEPLOYED: "published",
}

// fields on the user table that cannot be edited
export const UNEDITABLE_USER_FIELDS = [
  "email",
  "password",
  "roleId",
  "status",
  "firstName",
  "lastName",
]

export const LAYOUT_NAMES = {
  MASTER: {
    PRIVATE: "layout_private_master",
    PUBLIC: "layout_private_master",
  },
}

export const BUDIBASE_INTERNAL_DB = "bb_internal"

export const SPECTRUM_THEMES = {
  LIGHTER: "lighter",
  LIGHT: "light",
  DARK: "dark",
  DARKEST: "darkest"
}
