import { newid } from "../../../../src/docIds/newid"

export function id() {
  return `tenant-${newid()}`
}
