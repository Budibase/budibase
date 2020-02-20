import { createApp } from "@budibase/client/src/createApp"
import components from "./testComponents"
import packageJson from "../../package.json"
import { rootComponent } from "./rootComponent"
import * as standardcomponents from "@budibase/standard-components/src/index"

export default async props => {
  delete components._lib
  const componentLibraries = {}
  componentLibraries[packageJson.name] = components
  componentLibraries["testcomponents"] = {
    rootComponent: rootComponent(window),
  }
  componentLibraries["@budibase/standard-components"] = standardcomponents
  const appDef = { hierarchy: {}, actions: {} }
  const user = { name: "yeo", permissions: [] }
  const { initialisePage } = createApp(
    componentLibraries,
    { appRootPath: "" },
    appDef,
    user,
    {}
  )
  return initialisePage
}
