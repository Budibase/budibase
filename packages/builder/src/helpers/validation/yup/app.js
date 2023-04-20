import { _ } from "../../../../lang/i18n"
import { string, mixed } from "yup"
import { APP_NAME_REGEX, APP_URL_REGEX } from "constants"

export const name = (validation, { apps, currentApp } = { apps: [] }) => {
  validation.addValidator(
    "name",
    string()
      .trim()
      .required($_("helpers.validation.yup.app.Your_must_have_name"))
      .matches(APP_NAME_REGEX, $_("helpers.validation.yup.app.App_name"))
      .test(
        "non-existing-app-name",
        $_("helpers.validation.yup.app.Another_same_name"),
        value => {
          if (!value) {
            // exit early, above validator will fail
            return true
          }
          if (currentApp) {
            // filter out the current app if present
            apps = apps.filter(app => app.appId !== currentApp.appId)
          }
          return !apps
            .map(app => app.name)
            .some(appName => appName.toLowerCase() === value.toLowerCase())
        }
      )
  )
}

export const url = (validation, { apps, currentApp } = { apps: [] }) => {
  validation.addValidator(
    "url",
    string()
      .trim()
      .nullable()
      .required($_("helpers.validation.yup.app.Your_must_have_url"))
      .matches(APP_URL_REGEX, "Please enter a valid url")
      .test(
        "non-existing-app-url",
        $_("helpers.validation.yup.app.Another_same_URL"),
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
            .some(appUrl => appUrl?.toLowerCase() === value.toLowerCase())
        }
      )
      .test("valid-url", $_("helpers.validation.yup.app.Not_valid"), value => {
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

export const file = (validation, { template } = {}) => {
  const templateToUse =
    template && Object.keys(template).length === 0 ? null : template
  validation.addValidator(
    "file",
    templateToUse?.fromFile
      ? mixed().required($_("helpers.validation.yup.app.Please_choose"))
      : null
  )
}
