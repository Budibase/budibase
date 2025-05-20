import { newTool } from "@budibase/types"
import { MCPBaseClient } from "./mcpBase"
import { z } from "zod"

/**
 * GitHub MCP Client
 * Implements MCP client for GitHub
 */
export class GitHubClient extends MCPBaseClient {
  private client: any // Would be a properly typed client in production

  constructor() {
    super(
      "github", 
      "https://api.github.com", 
      "test-github-token" // Hard-coded for testing
    )
    
    // Mock client for testing
    this.client = {
      repos: {
        list: async ({ owner }: { owner: string }) => [
          { id: "repo1", name: "test-repo-1", owner },
          { id: "repo2", name: "test-repo-2", owner }
        ]
      },
      issues: {
        create: async (params: any) => ({
          id: "GH-123",
          number: 123,
          title: params.title,
          body: params.body,
          repo: params.repo,
          owner: params.owner,
          status: "open",
          created_at: new Date().toISOString()
        })
      }
    }
  }

  /**
   * List repositories for a GitHub user or organization
   */
  async listRepositories(owner: string): Promise<any[]> {
    try {
      return await this.client.repos.list({ owner })
    } catch (error) {
      console.error(`Error listing GitHub repositories: ${error}`)
      return []
    }
  }

  /**
   * Create issue in GitHub repository
   */
  async createIssue(owner: string, repo: string, title: string, body: string): Promise<any> {
    try {
      return await this.client.issues.create({ owner, repo, title, body })
    } catch (error) {
      console.error(`Error creating GitHub issue: ${error}`)
      throw error
    }
  }

  /**
   * Get tools for GitHub MCP
   */
  fetchTools() {
    return [
      newTool({
        name: "github_list_repositories",
        description: "List repositories for a GitHub user or organization",
        parameters: z.object({
          owner: z.string().describe("The GitHub username or organization name"),
        }),
        handler: async ({ owner }) => {
          const repos = await this.listRepositories(owner)
          const formatted = JSON.stringify(repos, null, 2)
          return `Here are the repositories for ${owner} on GitHub:\n\n${formatted}`
        },
      }),
      newTool({
        name: "github_create_issue",
        description: "Create an issue in a GitHub repository",
        parameters: z.object({
          owner: z.string().describe("The GitHub username or organization that owns the repository"),
          repo: z.string().describe("The name of the repository"),
          title: z.string().describe("Title of the issue"),
          body: z.string().describe("Content/description of the issue"),
        }),
        handler: async ({ owner, repo, title, body }) => {
          const issue = await this.createIssue(owner, repo, title, body)
          const formatted = JSON.stringify(issue, null, 2)
          return `Successfully created issue in GitHub repository ${owner}/${repo}:\n\n${formatted}`
        },
      }),
    ]
  }
}