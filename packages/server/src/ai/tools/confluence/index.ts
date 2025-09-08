import fetch from "node-fetch"
import { z } from "zod"
import { newTool } from ".."
import env from "../../../environment"

export class ConfluenceClient {
  private apiToken: string
  private email: string
  private baseUrl: string

  constructor(apiToken?: string, email?: string, baseUrl?: string) {
    this.apiToken = apiToken || env.ATLASSIAN_API_TOKEN || ""
    this.email = email || env.ATLASSIAN_EMAIL || ""
    this.baseUrl =
      baseUrl || env.ATLASSIAN_BASE_URL || "https://budibase.atlassian.net"
  }

  /**
   * Get basic auth header for Confluence API
   */
  private getAuthHeader(): string {
    if (!this.email || !this.apiToken) {
      throw new Error(
        "Confluence email and API token are required for authentication"
      )
    }
    const auth = Buffer.from(`${this.email}:${this.apiToken}`).toString(
      "base64"
    )
    return `Basic ${auth}`
  }

  /**
   * Make API request to Confluence v2 API
   */
  private async makeRequest(
    endpoint: string,
    options: {
      method?: string
      body?: string
      headers?: Record<string, string>
    } = {}
  ): Promise<any> {
    const url = `${this.baseUrl}/wiki/api/v2${endpoint}`

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
      const errorText = await response.text()
      throw new Error(
        `HTTP ${response.status}: ${response.statusText} - ${errorText}`
      )
    }

    return response.json()
  }

  getTools() {
    return [
      newTool({
        name: "confluence_text_search",
        description:
          "Perform deep text search across Confluence content using CQL",
        parameters: z.object({
          query: z.string().describe("Text to search for in content"),
          contentType: z
            .enum(["page", "blogpost", "comment", "attachment"])
            .optional()
            .describe("Type of content to search"),
          limit: z
            .number()
            .optional()
            .describe("Maximum number of results to return"),
        }),
        handler: async ({ query, contentType, limit = 10 }) => {
          // Use v1 API for CQL search as v2 doesn't support full CQL
          const url = `${this.baseUrl}/wiki/rest/api/content/search`

          // Build CQL query for text search
          let cql = `text ~ "${query}~"`

          if (contentType) {
            cql += ` AND type = "${contentType}"`
          }

          const params = new URLSearchParams({
            cql,
            limit: limit.toString(),
            expand: "body.storage,space,version,history.lastUpdated",
          })

          const response = await fetch(`${url}?${params}`, {
            headers: {
              Authorization: this.getAuthHeader(),
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(
              `HTTP ${response.status}: ${response.statusText} - ${errorText}`
            )
          }

          const results = await response.json()
          return JSON.stringify(results, null, 2)
        },
      }),

      newTool({
        name: "confluence_get_page",
        description: "Get a Confluence page by ID using v2 API",
        parameters: z.object({
          page_id: z.string().describe("The Confluence page ID"),
          bodyFormat: z
            .string()
            .optional()
            .describe("Body format (storage, atlas_doc_format, view)"),
        }),
        handler: async ({ page_id, bodyFormat = "storage" }) => {
          const params = new URLSearchParams({
            "body-format": bodyFormat,
          })
          const page = await this.makeRequest(`/pages/${page_id}?${params}`)
          return JSON.stringify(page, null, 2)
        },
      }),

      newTool({
        name: "confluence_list_spaces",
        description: "List Confluence spaces using v2 API",
        parameters: z.object({
          limit: z
            .number()
            .optional()
            .describe("Maximum number of spaces to return"),
          type: z.string().optional().describe("Space type filter"),
          status: z
            .enum(["current", "archived"])
            .optional()
            .describe("Space status filter"),
        }),
        handler: async ({ limit = 100, type, status }) => {
          const params = new URLSearchParams({
            limit: limit.toString(),
          })
          if (type) {
            params.append("type", type)
          }
          if (status) {
            params.append("status", status)
          }
          const spaces = await this.makeRequest(`/spaces?${params}`)
          return JSON.stringify(spaces, null, 2)
        },
      }),

      newTool({
        name: "confluence_get_space",
        description: "Get details about a Confluence space using v2 API",
        parameters: z.object({
          space_id: z.string().describe("The Confluence space ID"),
        }),
        handler: async ({ space_id }) => {
          const space = await this.makeRequest(`/spaces/${space_id}`)
          return JSON.stringify(space, null, 2)
        },
      }),

      newTool({
        name: "confluence_create_page",
        description: "Create a new Confluence page using v2 API",
        parameters: z.object({
          space_id: z
            .string()
            .describe("The Confluence space ID where the page will be created"),
          title: z.string().describe("The page title"),
          content: z
            .string()
            .describe("The page content in Confluence storage format"),
          parent_id: z.string().optional().describe("Optional parent page ID"),
          status: z
            .enum(["current", "draft"])
            .optional()
            .describe("Page status"),
        }),
        handler: async ({
          space_id,
          title,
          content,
          parent_id,
          status = "current",
        }) => {
          // Ensure proper formatting by converting escaped newlines to actual newlines
          const formattedContent = content
            .replace(/\\n/g, "\n")
            .replace(/\\r\\n/g, "\n")

          const body: any = {
            spaceId: space_id,
            status,
            title,
            body: {
              representation: "storage",
              value: formattedContent,
            },
          }

          if (parent_id) {
            body.parentId = parent_id
          }

          const page = await this.makeRequest("/pages", {
            method: "POST",
            body: JSON.stringify(body),
          })
          return JSON.stringify(page, null, 2)
        },
      }),

      newTool({
        name: "confluence_update_page",
        description: "Update an existing Confluence page using v2 API",
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
          // Ensure proper formatting by converting escaped newlines to actual newlines
          const formattedContent = content
            .replace(/\\n/g, "\n")
            .replace(/\\r\\n/g, "\n")

          const body = {
            id: page_id,
            status: "current",
            title,
            body: {
              representation: "storage",
              value: formattedContent,
            },
            version: {
              number: version + 1,
              message: "Updated via Budibase Agent",
            },
          }

          const page = await this.makeRequest(`/pages/${page_id}`, {
            method: "PUT",
            body: JSON.stringify(body),
          })
          return JSON.stringify(page, null, 2)
        },
      }),
    ]
  }
}
