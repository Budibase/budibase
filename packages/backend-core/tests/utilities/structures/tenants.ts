import { newid } from "../../../src/newid"

export function id() {
  return `tenant-${newid()}`
}
