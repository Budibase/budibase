import { Workspace } from "@budibase/types"
import { mixed, string } from "yup"
import { ValidationStore } from "."
import { APP_NAME_REGEX, APP_URL_REGEX } from "../../../constants"

export const name = (
  validation: ValidationStore,
  { apps, currentApp }: { apps: Workspace[]; currentApp?: Workspace } = {
    apps: [],
  }
) => {
  validation.addValidator(
    "name",
    string()
      .trim()
      .required(`Your workspace must have a name`)
      .matches(
        APP_NAME_REGEX,
        "Workspace name must be letters, numbers and spaces only"
      )
      .test(
        "non-existing-app-name",
        "Another workspace with the same name already exists",
        value => {
          if (!value) {
            // exit early, above validator will fail
            return true
          }
          return !apps
            .filter(app => {
              return app.appId !== currentApp?.appId
            })
            .map(app => app.name)
            .some(appName => appName.toLowerCase() === value.toLowerCase())
        }
      )
  )
}

export const url = (
  validation: ValidationStore,
  { apps, currentApp }: { apps: Workspace[]; currentApp?: Workspace } = {
    apps: [],
  }
) => {
  validation.addValidator(
    "url",
    string()
      .trim()
      .nullable()
      .required(`Your workspace must have a url`)
      .matches(APP_URL_REGEX, "Please enter a valid url")
      .test(
        "non-existing-app-url",
        `Another workspace with the same URL already exists`,
        value => {
          if (!value) {
            return true
          }
          if (currentApp) {
            // filter out the current app if present
            apps = apps.filter(app => app.appId !== currentApp.appId)
          }
          return !apps
            .map(app => app.url)
            .some(appUrl => {
              const url =
                appUrl?.[0] === "/"
                  ? appUrl.substring(1, appUrl.length)
                  : appUrl
              return url?.toLowerCase() === value.toLowerCase()
            })
        }
      )
      .test("valid-url", "Not a valid URL", value => {
        // url is nullable
        if (!value) {
          return true
        }
        // make it clear that this is a url path and cannot be a full url
        return (
          !value.includes("http") &&
          !value.includes("www") &&
          !value.includes(".")
        )
      })
  )
}

export const file = (
  validation: ValidationStore,
  { template }: { template?: { fromFile: boolean } | null } = {}
) => {
  const templateToUse =
    template && Object.keys(template).length === 0 ? null : template
  validation.addValidator(
    "file",
    templateToUse?.fromFile
      ? mixed().required("Please choose a file to import")
      : null
  )
}
