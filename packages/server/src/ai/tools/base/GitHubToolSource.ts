import { Tool, AgentToolSource, GitHubToolAuth } from "@budibase/types"
import { ToolSource } from "./ToolSource"
import { GitHubClient } from "../github"

export class GitHubToolSource extends ToolSource {
  private client: GitHubClient

  constructor(toolSource: AgentToolSource) {
    super(toolSource)
    const auth = toolSource.auth as GitHubToolAuth
    this.client = new GitHubClient(auth?.apiKey)
  }

  getType(): string {
    return "GITHUB"
  }

  getName(): string {
    return "GitHub"
  }

  getTools(): Tool[] {
    return this.client.getTools()
  }

  validate(): boolean {
    const auth = this.toolSource.auth as GitHubToolAuth
    return !!auth?.apiKey
  }
}
