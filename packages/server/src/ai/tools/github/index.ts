import { newTool } from "@budibase/types"
import { Octokit } from "@octokit/rest"
import { z } from "zod"

export class GitHubClient {
  private octokit: Octokit

  constructor(apiToken?: string) {
    this.octokit = new Octokit({
      auth: apiToken || process.env.GITHUB_TOKEN,
      userAgent: "Budibase-Agent",
      baseUrl: "https://api.github.com",
    })
  }

  getTools() {
    return [
      newTool({
        name: "github_list_repositories",
        description: "List repositories for a GitHub user",
        parameters: z.object({
          owner: z
            .string()
            .describe("The GitHub username or organization name"),
        }),
        handler: async ({ owner }) => {
          const { data } = await this.octokit.repos.listForUser({
            username: owner,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_org_repositories",
        description: "List repositories for a GitHub organization",
        parameters: z.object({
          org: z.string().describe("The GitHub organization name"),
        }),
        handler: async ({ org }) => {
          const { data } = await this.octokit.repos.listForOrg({ org })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_get_repository",
        description: "Get details about a GitHub repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
        }),
        handler: async ({ owner, repo }) => {
          const { data } = await this.octokit.repos.get({ owner, repo })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_get_user_profile",
        description: "Get a GitHub user profile",
        parameters: z.object({
          username: z.string().describe("The GitHub username"),
        }),
        handler: async ({ username }) => {
          const { data } = await this.octokit.users.getByUsername({
            username,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_issues",
        description: "List issues in a repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          state: z
            .enum(["open", "closed", "all"])
            .optional()
            .describe("State of issues to return"),
        }),
        handler: async ({ owner, repo, state = "open" }) => {
          const { data } = await this.octokit.issues.listForRepo({
            owner,
            repo,
            state: state as "open" | "closed" | "all",
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_get_issue",
        description: "Get details about a specific issue",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          issue_number: z.number().describe("The issue number"),
        }),
        handler: async ({ owner, repo, issue_number }) => {
          const { data } = await this.octokit.issues.get({
            owner,
            repo,
            issue_number,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_create_issue",
        description: "Create an issue in a GitHub repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          title: z.string().describe("Title of the issue"),
          body: z.string().describe("Content/description of the issue"),
          labels: z
            .array(z.string())
            .optional()
            .describe("Labels to add to the issue"),
        }),
        handler: async ({ owner, repo, title, body, labels }) => {
          // Ensure proper formatting by converting escaped newlines to actual newlines
          const formattedBody = body
            .replace(/\\n/g, "\n")
            .replace(/\\r\\n/g, "\n")

          const { data } = await this.octokit.issues.create({
            owner,
            repo,
            title,
            body: formattedBody,
            labels,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_update_issue",
        description: "Update an existing issue in a GitHub repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          issue_number: z.number().describe("The issue number"),
          title: z.string().optional().describe("New title of the issue"),
          body: z
            .string()
            .optional()
            .describe("New content/description of the issue"),
          state: z
            .enum(["open", "closed"])
            .optional()
            .describe("State of the issue"),
          labels: z
            .array(z.string())
            .optional()
            .describe("Labels to set on the issue"),
        }),
        handler: async ({
          owner,
          repo,
          issue_number,
          title,
          body,
          state,
          labels,
        }) => {
          const updateData: any = {}
          if (title) updateData.title = title
          if (body) {
            // Ensure proper formatting by converting escaped newlines to actual newlines
            updateData.body = body
              .replace(/\\n/g, "\n")
              .replace(/\\r\\n/g, "\n")
          }
          if (state) updateData.state = state
          if (labels) updateData.labels = labels

          const { data } = await this.octokit.issues.update({
            owner,
            repo,
            issue_number,
            ...updateData,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_pull_requests",
        description: "List pull requests in a repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          state: z
            .enum(["open", "closed", "all"])
            .optional()
            .describe("State of pull requests to return"),
        }),
        handler: async ({ owner, repo, state = "open" }) => {
          const { data } = await this.octokit.pulls.list({
            owner,
            repo,
            state: state as "open" | "closed" | "all",
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_get_pull_request",
        description: "Get details about a specific pull request",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          pull_number: z.number().describe("The pull request number"),
        }),
        handler: async ({ owner, repo, pull_number }) => {
          const { data } = await this.octokit.pulls.get({
            owner,
            repo,
            pull_number,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_commits",
        description: "List commits in a repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          path: z
            .string()
            .optional()
            .describe(
              "Only commits containing this file path will be returned"
            ),
        }),
        handler: async ({ owner, repo, path }) => {
          const { data } = await this.octokit.repos.listCommits({
            owner,
            repo,
            path,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_get_commit",
        description: "Get details about a specific commit",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          ref: z.string().describe("The commit SHA"),
        }),
        handler: async ({ owner, repo, ref }) => {
          const { data } = await this.octokit.repos.getCommit({
            owner,
            repo,
            ref,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_branches",
        description: "List branches in a repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
        }),
        handler: async ({ owner, repo }) => {
          const { data } = await this.octokit.repos.listBranches({
            owner,
            repo,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_list_workflows",
        description: "List GitHub Actions workflows for a repository",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
        }),
        handler: async ({ owner, repo }) => {
          const { data } = await this.octokit.actions.listRepoWorkflows({
            owner,
            repo,
          })
          return JSON.stringify(data, null, 2)
        },
      }),

      newTool({
        name: "github_trigger_workflow",
        description: "Trigger a GitHub Actions workflow",
        parameters: z.object({
          owner: z
            .string()
            .describe(
              "The GitHub username or organization that owns the repository"
            ),
          repo: z.string().describe("The repository name"),
          workflow_id: z.string().describe("The workflow ID or filename"),
          ref: z
            .string()
            .optional()
            .describe(
              "The git reference (branch or tag) to run the workflow on"
            ),
        }),
        handler: async ({ owner, repo, workflow_id, ref = "main" }) => {
          await this.octokit.actions.createWorkflowDispatch({
            owner,
            repo,
            workflow_id,
            ref,
          })
          return JSON.stringify(
            { success: true, message: "Workflow dispatch created" },
            null,
            2
          )
        },
      }),
    ]
  }
}
