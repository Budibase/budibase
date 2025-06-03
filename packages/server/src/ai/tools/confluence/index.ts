import { newTool } from "@budibase/types"
import fetch from "node-fetch"
import { z } from "zod"

export class ConfluenceClient {
  private apiToken: string
  private email: string
  private baseUrl: string

  constructor(apiToken?: string, email?: string, baseUrl?: string) {
    this.apiToken = apiToken || process.env.ATLASSIAN_API_TOKEN || ""
    this.email = email || process.env.ATLASSIAN_EMAIL || ""
    this.baseUrl =
      baseUrl ||
      process.env.ATLASSIAN_BASE_URL ||
      "https://your-domain.atlassian.net"
  }

  /**
   * Get basic auth header for Confluence API
   */
  private getAuthHeader(): string {
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      "base64"
    )
    return `Basic ${auth}`
  }

  /**
   * Make API request to Confluence
   */
  private async makeRequest(endpoint: string, options: any = {}): Promise<any> {
    const url = `${this.baseUrl}${endpoint}`
    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: this.getAuthHeader(),
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json()
  }

  getTools() {
    return [
      newTool({
        name: "confluence_search_content",
        description: "Search for content in Confluence",
        parameters: z.object({
          query: z.string().describe("The search query"),
          limit: z
            .number()
            .optional()
            .describe("Maximum number of results to return"),
        }),
        handler: async ({ query, limit = 10 }) => {
          try {
            const params = new URLSearchParams({
              cql: `text ~ "${query}"`,
              limit: limit.toString(),
            })
            const results = await this.makeRequest(
              `/wiki/rest/api/content/search?${params}`
            )
            return JSON.stringify(results, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),

      newTool({
        name: "confluence_get_page",
        description: "Get a Confluence page by ID",
        parameters: z.object({
          page_id: z.string().describe("The Confluence page ID"),
        }),
        handler: async ({ page_id }) => {
          try {
            const page = await this.makeRequest(
              `/wiki/rest/api/content/${page_id}?expand=body.storage,version`
            )
            return JSON.stringify(page, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),

      newTool({
        name: "confluence_list_spaces",
        description: "List Confluence spaces",
        parameters: z.object({
          limit: z
            .number()
            .optional()
            .describe("Maximum number of spaces to return"),
        }),
        handler: async ({ limit = 25 }) => {
          try {
            const spaces = await this.makeRequest(
              `/wiki/rest/api/space?limit=${limit}`
            )
            return JSON.stringify(spaces, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),

      newTool({
        name: "confluence_get_space",
        description: "Get details about a Confluence space",
        parameters: z.object({
          space_key: z.string().describe("The Confluence space key"),
        }),
        handler: async ({ space_key }) => {
          try {
            const space = await this.makeRequest(
              `/wiki/rest/api/space/${space_key}`
            )
            return JSON.stringify(space, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),

      newTool({
        name: "confluence_create_page",
        description: "Create a new Confluence page",
        parameters: z.object({
          space_key: z
            .string()
            .describe(
              "The Confluence space key where the page will be created"
            ),
          title: z.string().describe("The page title"),
          content: z
            .string()
            .describe("The page content in Confluence storage format"),
          parent_id: z.string().optional().describe("Optional parent page ID"),
        }),
        handler: async ({ space_key, title, content, parent_id }) => {
          try {
            const body: any = {
              type: "page",
              title,
              space: { key: space_key },
              body: {
                storage: {
                  value: content,
                  representation: "storage",
                },
              },
            }

            if (parent_id) {
              body.ancestors = [{ id: parent_id }]
            }

            const page = await this.makeRequest("/wiki/rest/api/content", {
              method: "POST",
              body: JSON.stringify(body),
            })
            return JSON.stringify(page, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),

      newTool({
        name: "confluence_update_page",
        description: "Update an existing Confluence page",
        parameters: z.object({
          page_id: z.string().describe("The Confluence page ID"),
          title: z.string().describe("The updated page title"),
          content: z
            .string()
            .describe("The updated page content in Confluence storage format"),
          version: z
            .number()
            .describe("The current version number of the page"),
        }),
        handler: async ({ page_id, title, content, version }) => {
          try {
            const body = {
              type: "page",
              title,
              body: {
                storage: {
                  value: content,
                  representation: "storage",
                },
              },
              version: {
                number: version + 1,
              },
            }

            const page = await this.makeRequest(
              `/wiki/rest/api/content/${page_id}`,
              {
                method: "PUT",
                body: JSON.stringify(body),
              }
            )
            return JSON.stringify(page, null, 2)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        },
      }),
    ]
  }
}
