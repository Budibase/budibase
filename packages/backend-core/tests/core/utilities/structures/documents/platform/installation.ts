import { Installation } from "@budibase/types"
import * as db from "../../db"
import { generator } from "../../generator"

export function install(): Installation {
  return {
    _id: "install",
    _rev: db.rev(),
    installId: generator.guid(),
    version: generator.string(),
  }
}
