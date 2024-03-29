import { UserGroup } from "@budibase/types"
import { generator } from "./generator"

export function userGroup(): UserGroup {
  return {
    name: generator.guid(),
    icon: generator.word(),
    color: generator.word(),
  }
}
