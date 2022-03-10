import { components } from "./openapi"

export type App = components["schemas"]["applicationOutput"]["data"]
export type Table = components["schemas"]["tableOutput"]["data"]
export type TableSearch = components["schemas"]["tableSearch"]
export type AppSearch = components["schemas"]["applicationSearch"]
export type RowSearch = components["schemas"]["searchOutput"]
