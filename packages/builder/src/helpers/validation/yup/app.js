import { string, mixed } from "yup"
import { APP_NAME_REGEX, APP_URL_REGEX } from "constants"

export const name = (validation, { apps, currentApp } = { apps: [] }) => {
  let existingApps = Object.values(apps)
  validation.addValidator(
    "name",
    string()
      .required("Your application must have a name")
      .matches(APP_NAME_REGEX, "App name must be letters and numbers only")
      .test(
        "non-existing-app-name",
        "Another app with the same name already exists",
        value => {
          if (!value) {
            return true
          }
          if (currentApp) {
            // filter out the current app if present
            existingApps = existingApps
              // match the id format of the current app (remove 'app_')
              .map(app => ({ ...app, appId: app.appId.substring(4) }))
              .filter(app => app.appId !== currentApp.appId)
          }
          return !existingApps
            .map(app => app.name)
            .some(appName => appName.toLowerCase() === value.toLowerCase())
        }
      )
  )
}

export const url = (validation, { apps, currentApp } = { apps: {} }) => {
  let existingApps = Object.values(apps)
  validation.addValidator(
    "url",
    string()
      .nullable()
      .matches(APP_URL_REGEX, "App URL must not contain spaces")
      .test(
        "non-existing-app-url",
        "Another app with the same URL already exists",
        value => {
          // url is nullable
          if (!value) {
            return true
          }
          if (currentApp) {
            existingApps = existingApps
              // match the id format of the current app (remove 'app_')
              .map(app => ({ ...app, appId: app.appId.substring(4) }))
              // filter out the current app if present
              .filter(app => app.appId !== currentApp.appId)
          }
          return !existingApps
            .map(app => app.url)
            .some(appUrl => appUrl.toLowerCase() === value.toLowerCase())
        }
      )
      .test("start-with-slash", "Not a valid URL", value => {
        // url is nullable
        if (!value) {
          return true
        }
        return value.length > 1
      })
  )
}

export const file = (validation, { template } = {}) => {
  const templateToUse =
    template && Object.keys(template).length === 0 ? null : template
  validation.addValidator(
    "file",
    templateToUse?.fromFile
      ? mixed().required("Please choose a file to import")
      : null
  )
}
