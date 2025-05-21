import { Tool } from "@budibase/types"

export abstract class MCPBaseClient {
  protected baseUrl: string
  protected providerName: string

  protected constructor(provider: string, baseUrl: string) {
    this.providerName = provider
    this.baseUrl = baseUrl
  }

  abstract fetchTools(): Promise<Tool[]>
}