import { newid } from "../../../src/newid"

export function name() {
  return `tenant-${newid()}`
}
