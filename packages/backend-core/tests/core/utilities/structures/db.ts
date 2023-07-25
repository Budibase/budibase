import { generator } from "./generator"
import { newid } from "../../../../src/docIds/newid"

export function id() {
  return `db_${newid()}`
}

export function rev() {
  return `${generator.character({
    numeric: true,
  })}-${generator.guid().replace(/-/, "")}`
}
