export * from "./users"
import { users } from "@budibase/backend-core"
import * as pro from "@budibase/pro"
// pass in the components which are specific to the worker/the parts of pro which backend-core cannot access
users.UserDB.init(pro.quotas, pro.groups, pro.features)
export const db = users.UserDB
export { users as core } from "@budibase/backend-core"
