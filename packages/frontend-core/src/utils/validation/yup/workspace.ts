import { Workspace } from "@budibase/types"
import { mixed, string } from "yup"
import { ValidationStore } from "."
import { APP_NAME_REGEX, APP_URL_REGEX } from "../../../constants"

interface ValidationContext {
  workspaces: Workspace[]
  currentWorkspace?: Workspace
}

const defaultContext = {
  workspaces: [],
}

export const name = (
  validation: ValidationStore,
  { workspaces, currentWorkspace }: ValidationContext = defaultContext
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
          return !workspaces
            .filter(workspace => {
              return workspace.appId !== currentWorkspace?.appId
            })
            .map(workspace => workspace.name)
            .some(
              workspaceName =>
                workspaceName.toLowerCase() === value.toLowerCase()
            )
        }
      )
  )
}

export const url = (
  validation: ValidationStore,
  { workspaces, currentWorkspace }: ValidationContext = defaultContext
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
          if (currentWorkspace) {
            // filter out the current workspace if present
            workspaces = workspaces.filter(
              workspace => workspace.appId !== currentWorkspace.appId
            )
          }
          return !workspaces
            .map(workspace => workspace.url)
            .some(workspaceUrl => {
              const url =
                workspaceUrl?.[0] === "/"
                  ? workspaceUrl.substring(1, workspaceUrl.length)
                  : workspaceUrl
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
