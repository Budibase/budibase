import { createApp } from "@budibase/client/src/createApp"
import components from "./testComponents"
import packageJson from "../../package.json"

export default async () => {
  delete components._lib

  const componentLibraries = {}
  componentLibraries[packageJson.name] = components

  const appDef = { hierarchy: {}, actions: {} }
  const user = { name: "yeo", permissions: [] }

  var app = createApp(componentLibraries, appDef, user)
  return app
}
