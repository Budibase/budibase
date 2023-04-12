import { v4 } from "uuid"

export function newid() {
  return v4().replace(/-/g, "")
}
