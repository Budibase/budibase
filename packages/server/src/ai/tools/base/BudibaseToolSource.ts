import { Tool } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import budibase from "../budibase"

export class BudibaseToolSource extends ToolSource {
  getType(): string {
    return "BUDIBASE"
  }

  getName(): string {
    return "Budibase"
  }

  getTools(): Tool[] {
    return budibase
  }

  validate(): boolean {
    // Budibase tools don't require external authentication
    return true
  }
}
