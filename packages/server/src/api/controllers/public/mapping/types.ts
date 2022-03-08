import { components } from "../../../../definitions/openapi"

export type Query = components["schemas"]["query"]
export type ExecuteQuery = components["schemas"]["executeQueryOutput"]

export type Application = components["schemas"]["applicationOutput"]["data"]

export type Table = components["schemas"]["tableOutput"]["data"]

export type Row = components["schemas"]["rowOutput"]["data"]
export type RowSearch = components["schemas"]["searchOutput"]

export type User = components["schemas"]["userOutput"]["data"]
