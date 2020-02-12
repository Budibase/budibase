import { createApp } from "@budibase/client/src/createApp"
import components from "./testComponents"
import packageJson from "../../package.json"
import { rootComponent } from "./rootComponent"
export default async props => {
  delete components._lib
  const componentLibraries = {}
  componentLibraries[packageJson.name] = components
  componentLibraries["testcomponents"] = {
    rootComponent: rootComponent(window)
  }
  const appDef = { hierarchy: {}, actions: {} }
  const user = { name: "yeo", permissions: [] }
  const { initialisePage } = createApp(
    window.document,
    componentLibraries,
    { appRootPath: "" },
    appDef,
    user,
    {},
    []
  )
  return initialisePage
}