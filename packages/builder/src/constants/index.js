export const TableNames = {
  USERS: "ta_users",
}

// fields on the user table that cannot be edited
export const UNEDITABLE_USER_FIELDS = ["email", "password", "accessLevelId"]

export const DEFAULT_PAGES_OBJECT = {
  main: {
    props: {
      _component: "@budibase/standard-components/container",
    },
    _screens: {},
  },
  unauthenticated: {
    props: {
      _component: "@budibase/standard-components/container",
    },
    _screens: {},
  },
  componentLibraries: [],
  stylesheets: [],
}
