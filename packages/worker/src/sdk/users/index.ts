export * from "./users"
import { users } from "@budibase/backend-core"
import * as pro from "@budibase/pro"
// pass in the components which are specific to the worker/the parts of pro which backend-core cannot access
export const db = new users.UserDB(pro.quotas, pro.groups, pro.features)
export { users as core } from "@budibase/backend-core"
