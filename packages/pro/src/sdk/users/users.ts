import { users } from "@budibase/backend-core"
import * as features from "../features"
import * as groups from "../groups"
import * as quotas from "../quotas"

users.UserDB.init(quotas, groups, features)
export const db = users.UserDB
