import { components } from "./openapi"

export type App = components["schemas"]["applicationOutput"]["data"]
export type AppSearch = {
  data: App[]
}
export type RowSearch = components["schemas"]["searchOutput"]