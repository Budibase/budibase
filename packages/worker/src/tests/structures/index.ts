import { structures } from "@budibase/backend-core/tests"
import * as configs from "./configs"
import * as users from "./users"
import * as groups from "./groups"
import { v4 as uuid } from "uuid"

export const TENANT_ID = "default"
export const TENANT_1 = "tenant1"
export const CSRF_TOKEN = "e3727778-7af0-4226-b5eb-f43cbe60a306"

const pkg = {
  ...structures,
  uuid,
  configs,
  users,
  TENANT_ID,
  TENANT_1,
  CSRF_TOKEN,
  groups,
}

export default pkg
