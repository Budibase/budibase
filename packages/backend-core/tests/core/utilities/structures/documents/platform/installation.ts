import { generator } from "../../generator"
import { Installation } from "@budibase/types"
import * as db from "../../db"

export function install(): Installation {
  return {
    _id: "install",
    _rev: db.rev(),
    installId: generator.guid(),
    version: generator.string(),
  }
}
