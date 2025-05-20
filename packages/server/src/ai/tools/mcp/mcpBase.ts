import { Tool } from "@budibase/types"

export abstract class MCPBaseClient {
  protected baseUrl: string
  protected apiKey: string
  protected providerName: string

  constructor(provider: string, baseUrl: string, apiKey: string = "") {
    this.providerName = provider
    this.baseUrl = baseUrl
    this.apiKey = apiKey
  }

  /**
   * Check if this MCP client is configured properly
   */
  isConfigured(): boolean {
    // For testing purposes, always return true
    // In production, this would verify the API key exists
    return true
  }

  /**
   * Abstract methods that must be implemented by provider-specific clients
   */
  async fetchTools(): Promise<Tool[]>
}