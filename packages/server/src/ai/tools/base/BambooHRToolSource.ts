import { Tool, AgentToolSource, BambooHRToolAuth } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { BambooHRClient } from "../bamboohr"

export class BambooHRToolSource extends ToolSource {
  private client: BambooHRClient

  constructor(toolSource: AgentToolSource) {
    super(toolSource)
    const auth = toolSource.auth as BambooHRToolAuth
    this.client = new BambooHRClient(auth?.apiKey, auth?.subdomain)
  }

  getType(): string {
    return "BAMBOOHR"
  }

  getName(): string {
    return "BambooHR"
  }

  getTools(): Tool[] {
    return this.client.getTools()
  }

  validate(): boolean {
    const auth = this.toolSource.auth as BambooHRToolAuth
    return !!(auth?.apiKey && auth?.subdomain)
  }
}
