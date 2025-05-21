import { Tool } from "@budibase/types"
import { MCPBaseClient } from "./mcpBase"
import { z } from "zod"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";


/**
 * Atlassian MCP Client
 * Implements MCP client for Atlassian products (Jira, Confluence, etc.)
 */
export class AtlassianClient extends MCPBaseClient {
  private client: any // Mock client for testing
  private mcpClient: Client | null = null

  constructor() {
    super(
      "atlassian",
      "http://localhost:8089/sse",
      ""
    )

    this.client = {
      resources: {},
      tools: {}
    }
  }

  /**
   * Get list of resources from Atlassian MCP
   */
  async fetchResources(): Promise<any[]> {
    try {
      return await this.client.listResources()
    } catch (error) {
      console.error(`Error fetching Atlassian MCP resources: ${error}`)
      return []
    }
  }

  /**
   * Connect to the Atlassian MCP server via MCP-Remote
   */
  async connectToAtlassianMCP(): Promise<Client> {
    try {
      // Create a client
      const client = new Client({
        name: "budibase-mcp-client",
        version: "1.0.0"
      })

      const transport = new SSEClientTransport(new URL(this.baseUrl))

      // Connect to the server
      await client.connect(transport)
      console.log("Connected to Atlassian MCP server.")

      this.mcpClient = client
      return client
    } catch (error) {
      console.error("Failed to connect to Atlassian MCP server:", error)
      throw error
    }
  }

  /**
   * Get the MCP client instance, connecting if needed
   */
  async getMCPClient(): Promise<Client> {
    if (!this.mcpClient) {
      return await this.connectToAtlassianMCP()
    }
    return this.mcpClient
  }

  /**
   * Fetch available tools from Atlassian MCP
   */
  async fetchTools(): Promise<Tool[]> {
    try {
      const client = await this.getMCPClient()
      const toolsResponse = await client.listTools()

      const tools = toolsResponse.tools.map(tool => {
        return {
          name: `atlassian_${tool.name}`,
          description: tool.description || "No description provided",
          schema: tool.inputSchema || { type: "object", properties: {} },
          handler: async (params: any) => {
            try {
              console.log(`Calling tool ${tool.name} with params:`, params);
              const result = await client.callTool({
                name: tool.name,
                arguments: params
              })
              return typeof result === "string" ? result : JSON.stringify(result)
            } catch (error) {
              console.error(`Error calling tool ${tool.name}:`, error)
              return `Error: Failed to execute Atlassian tool ${tool.name}`
            }
          }
        }
      })


      console.log(`Generated ${tools.length} Budibase tools from Atlassian MCP`)
      return tools
    } catch (error) {
      console.error("Error fetching Atlassian MCP tools:", error)
      return []
    }
  }
}