import { newid } from "../../../src/newid"

export function id() {
  return `db_${newid()}`
}
