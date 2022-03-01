import { components } from "../../../../definitions/openapi"

export type Query = components["schemas"]["query"]
export type ExecuteQueryOutput = components["schemas"]["executeQueryOutput"]

export type Application = components["schemas"]["applicationOutput"]["data"]
export type ApplicationOutput = components["schemas"]["applicationOutput"]

export type Table = components["schemas"]["tableOutput"]["data"]
export type TableOutput = components["schemas"]["tableOutput"]

export type Row = components["schemas"]["rowOutput"]["data"]
export type RowOutput = components["schemas"]["rowOutput"]
export type RowSearch = components["schemas"]["searchOutput"]

export type User = components["schemas"]["userOutput"]["data"]
export type UserOutput = components["schemas"]["userOutput"]
