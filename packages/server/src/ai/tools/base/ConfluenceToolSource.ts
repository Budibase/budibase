import { Tool, AgentToolSource, ConfluenceToolAuth } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { ConfluenceClient } from "../confluence"

export class ConfluenceToolSource extends ToolSource {
  private client: ConfluenceClient

  constructor(toolSource: AgentToolSource) {
    super(toolSource)
    const auth = toolSource.auth as ConfluenceToolAuth
    this.client = new ConfluenceClient(auth?.apiKey, auth?.email, auth?.baseUrl)
  }

  getType(): string {
    return "CONFLUENCE"
  }

  getName(): string {
    return "Confluence"
  }

  getTools(): Tool[] {
    return this.client.getTools()
  }

  validate(): boolean {
    const auth = this.toolSource.auth as ConfluenceToolAuth
    return !!(auth?.apiKey && auth?.email)
  }
}
