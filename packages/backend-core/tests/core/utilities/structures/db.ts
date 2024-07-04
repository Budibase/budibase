import { newid } from "../../../../src/docIds/newid"
import { generator } from "./generator"

export function id() {
  return `db_${newid()}`
}

export function rev() {
  return `${generator.character({
    numeric: true,
  })}-${generator.guid().replace(/-/, "")}`
}
