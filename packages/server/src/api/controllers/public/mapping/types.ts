import { components } from "../../../../definitions/openapi"

export type Query = components["schemas"]["query"]
export type ExecuteQuery = components["schemas"]["executeQueryOutput"]

export type Application = components["schemas"]["applicationOutput"]["data"]
export type CreateApplicationParams = components["schemas"]["application"]

export type Table = components["schemas"]["tableOutput"]["data"]
export type CreateTableParams = components["schemas"]["table"]

export type Row = components["schemas"]["rowOutput"]["data"]
export type RowSearch = components["schemas"]["searchOutput"]
export type CreateRowParams = components["schemas"]["row"]

export type User = components["schemas"]["userOutput"]["data"]
export type CreateUserParams = components["schemas"]["user"]

export type RoleAssignRequest = components["schemas"]["rolesAssign"]
export type RoleUnAssignRequest = components["schemas"]["rolesUnAssign"]
export type RoleAssignmentResponse = components["schemas"]["rolesOutput"]

export type SearchInputParams =
  | components["schemas"]["nameSearch"]
  | components["schemas"]["rowSearch"]
