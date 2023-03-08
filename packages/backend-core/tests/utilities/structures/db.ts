import { structures } from ".."
import { newid } from "../../../src/newid"

export function id() {
  return `db_${newid()}`
}

export function rev() {
  return `${structures.generator.character({
    numeric: true,
  })}-${structures.uuid().replace(/-/, "")}`
}
