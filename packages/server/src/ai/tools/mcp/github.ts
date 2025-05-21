import { Tool } from "@budibase/types"
import { MCPBaseClient } from "./mcpBase"
import { Octokit } from "@octokit/rest"
import { handleToolError } from "./errorHandler"

/**
 * GitHub Client
 * Implements client for GitHub API
 */
export class GitHubClient extends MCPBaseClient {
  private octokit: Octokit

  constructor() {
    super(
      "github",
      "https://api.github.com",
    )

    this.octokit = new Octokit({
      auth: process.env.GITHUB_TOKEN,
      userAgent: "Budibase-Agent",
      baseUrl: "https://api.github.com"
    })
  }

  /**
   * Get user profile
   */
  async getUserProfile(username: string): Promise<any> {
    const { data } = await this.octokit.users.getByUsername({ username })
    return data
  }

  /**
   * List repositories for a user or organization
   */
  async listRepositories(owner: string): Promise<any[]> {
    const { data } = await this.octokit.repos.listForUser({ username: owner })
    return data
  }

  /**
   * List organization repositories
   */
  async listOrgRepositories(org: string): Promise<any[]> {
    const { data } = await this.octokit.repos.listForOrg({ org })
    return data
  }

  /**
   * Get repository details
   */
  async getRepository(owner: string, repo: string): Promise<any> {
    const { data } = await this.octokit.repos.get({ owner, repo })
    return data
  }

  /**
   * List issues in a repository
   */
  async listIssues(owner: string, repo: string, state: string = "open"): Promise<any[]> {
    const { data } = await this.octokit.issues.listForRepo({ 
      owner, 
      repo, 
      state: state as "open" | "closed" | "all"
    })
    return data
  }

  /**
   * Get issue details
   */
  async getIssue(owner: string, repo: string, issueNumber: number): Promise<any> {
    const { data } = await this.octokit.issues.get({ 
      owner, 
      repo, 
      issue_number: issueNumber 
    })
    return data
  }

  /**
   * Create issue in GitHub repository
   */
  async createIssue(owner: string, repo: string, title: string, body: string, labels?: string[]): Promise<any> {
    const { data } = await this.octokit.issues.create({ 
      owner, 
      repo, 
      title, 
      body, 
      labels 
    })
    return data
  }

  /**
   * Update issue in GitHub repository
   */
  async updateIssue(owner: string, repo: string, issueNumber: number, updateData: any): Promise<any> {
    const { data } = await this.octokit.issues.update({ 
      owner, 
      repo, 
      issue_number: issueNumber,
      ...updateData
    })
    return data
  }

  /**
   * List pull requests in a repository
   */
  async listPullRequests(owner: string, repo: string, state: string = "open"): Promise<any[]> {
    const { data } = await this.octokit.pulls.list({ 
      owner, 
      repo, 
      state: state as "open" | "closed" | "all"
    })
    return data
  }

  /**
   * Get pull request details
   */
  async getPullRequest(owner: string, repo: string, pullNumber: number): Promise<any> {
    const { data } = await this.octokit.pulls.get({ 
      owner, 
      repo, 
      pull_number: pullNumber 
    })
    return data
  }

  /**
   * List commits in a repository
   */
  async listCommits(owner: string, repo: string, path?: string): Promise<any[]> {
    const { data } = await this.octokit.repos.listCommits({ 
      owner, 
      repo,
      path
    })
    return data
  }

  /**
   * Get commit details
   */
  async getCommit(owner: string, repo: string, ref: string): Promise<any> {
    const { data } = await this.octokit.repos.getCommit({ 
      owner, 
      repo, 
      ref 
    })
    return data
  }

  /**
   * List branches in a repository
   */
  async listBranches(owner: string, repo: string): Promise<any[]> {
    const { data } = await this.octokit.repos.listBranches({ owner, repo })
    return data
  }

  /**
   * Get branch details
   */
  async getBranch(owner: string, repo: string, branch: string): Promise<any> {
    const { data } = await this.octokit.repos.getBranch({ 
      owner, 
      repo, 
      branch 
    })
    return data
  }

  /**
   * Create workflow dispatch event
   */
  async createWorkflowDispatch(owner: string, repo: string, workflowId: string, ref: string, inputs?: any): Promise<void> {
    await this.octokit.actions.createWorkflowDispatch({
      owner,
      repo,
      workflow_id: workflowId,
      ref,
      inputs
    })
  }

  /**
   * Get workflows for a repository
   */
  async listWorkflows(owner: string, repo: string): Promise<any> {
    const { data } = await this.octokit.actions.listRepoWorkflows({ 
      owner, 
      repo 
    })
    return data
  }

  /**
   * Get workflow runs
   */
  async listWorkflowRuns(owner: string, repo: string, workflowId: string): Promise<any> {
    const { data } = await this.octokit.actions.listWorkflowRuns({ 
      owner, 
      repo, 
      workflow_id: workflowId 
    })
    return data
  }

  /**
   * Provide tools for GitHub
   */
  async fetchTools(): Promise<Tool[]> {
    // Instead of fetching from MCP, we define our own tools
    return [
      {
        name: "github_list_repositories",
        description: "List repositories for a GitHub user",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization name"
            }
          },
          required: ["owner"]
        },
        handler: async (params: any) => {
          try {
            const repos = await this.listRepositories(params.owner)
            return JSON.stringify(repos)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_org_repositories",
        description: "List repositories for a GitHub organization",
        schema: {
          type: "object",
          properties: {
            org: {
              type: "string",
              description: "The GitHub organization name"
            }
          },
          required: ["org"]
        },
        handler: async (params: any) => {
          try {
            const repos = await this.listOrgRepositories(params.org)
            return JSON.stringify(repos)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_get_repository",
        description: "Get details about a GitHub repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const repo = await this.getRepository(params.owner, params.repo)
            return JSON.stringify(repo)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_get_user_profile",
        description: "Get a GitHub user profile",
        schema: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "The GitHub username"
            }
          },
          required: ["username"]
        },
        handler: async (params: any) => {
          try {
            const profile = await this.getUserProfile(params.username)
            return JSON.stringify(profile)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_issues",
        description: "List issues in a repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            state: {
              type: "string",
              description: "State of issues to return: open, closed, or all",
              enum: ["open", "closed", "all"],
              default: "open"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const issues = await this.listIssues(params.owner, params.repo, params.state || "open")
            return JSON.stringify(issues)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_get_issue",
        description: "Get details about a specific issue",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            issue_number: {
              type: "number",
              description: "The issue number"
            }
          },
          required: ["owner", "repo", "issue_number"]
        },
        handler: async (params: any) => {
          try {
            const issue = await this.getIssue(params.owner, params.repo, params.issue_number)
            return JSON.stringify(issue)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_create_issue",
        description: "Create an issue in a GitHub repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            title: {
              type: "string",
              description: "Title of the issue"
            },
            body: {
              type: "string",
              description: "Content/description of the issue"
            },
            labels: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Labels to add to the issue"
            }
          },
          required: ["owner", "repo", "title", "body"]
        },
        handler: async (params: any) => {
          try {
            const issue = await this.createIssue(params.owner, params.repo, params.title, params.body, params.labels)
            return JSON.stringify(issue)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_update_issue",
        description: "Update an existing issue in a GitHub repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            issue_number: {
              type: "number",
              description: "The issue number"
            },
            title: {
              type: "string",
              description: "New title of the issue"
            },
            body: {
              type: "string",
              description: "New content/description of the issue"
            },
            state: {
              type: "string",
              description: "State of the issue (open or closed)",
              enum: ["open", "closed"]
            },
            labels: {
              type: "array",
              items: {
                type: "string"
              },
              description: "Labels to set on the issue"
            }
          },
          required: ["owner", "repo", "issue_number"]
        },
        handler: async (params: any) => {
          try {
            const data: any = {}
            if (params.title) data.title = params.title
            if (params.body) data.body = params.body
            if (params.state) data.state = params.state
            if (params.labels) data.labels = params.labels
            
            const issue = await this.updateIssue(params.owner, params.repo, params.issue_number, data)
            return JSON.stringify(issue)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_pull_requests",
        description: "List pull requests in a repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            state: {
              type: "string",
              description: "State of pull requests to return: open, closed, or all",
              enum: ["open", "closed", "all"],
              default: "open"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const prs = await this.listPullRequests(params.owner, params.repo, params.state || "open")
            return JSON.stringify(prs)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_get_pull_request",
        description: "Get details about a specific pull request",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            pull_number: {
              type: "number",
              description: "The pull request number"
            }
          },
          required: ["owner", "repo", "pull_number"]
        },
        handler: async (params: any) => {
          try {
            const pr = await this.getPullRequest(params.owner, params.repo, params.pull_number)
            return JSON.stringify(pr)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_commits",
        description: "List commits in a repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            path: {
              type: "string",
              description: "Only commits containing this file path will be returned"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const commits = await this.listCommits(params.owner, params.repo, params.path)
            return JSON.stringify(commits)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_get_commit",
        description: "Get details about a specific commit",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            ref: {
              type: "string",
              description: "The commit SHA"
            }
          },
          required: ["owner", "repo", "ref"]
        },
        handler: async (params: any) => {
          try {
            const commit = await this.getCommit(params.owner, params.repo, params.ref)
            return JSON.stringify(commit)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_branches",
        description: "List branches in a repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const branches = await this.listBranches(params.owner, params.repo)
            return JSON.stringify(branches)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_list_workflows",
        description: "List GitHub Actions workflows for a repository",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            }
          },
          required: ["owner", "repo"]
        },
        handler: async (params: any) => {
          try {
            const workflows = await this.listWorkflows(params.owner, params.repo)
            return JSON.stringify(workflows)
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      },
      {
        name: "github_trigger_workflow",
        description: "Trigger a GitHub Actions workflow",
        schema: {
          type: "object",
          properties: {
            owner: {
              type: "string",
              description: "The GitHub username or organization that owns the repository"
            },
            repo: {
              type: "string",
              description: "The repository name"
            },
            workflow_id: {
              type: "string",
              description: "The workflow ID or filename"
            },
            ref: {
              type: "string",
              description: "The git reference (branch or tag) to run the workflow on",
              default: "main"
            },
            inputs: {
              type: "object",
              description: "The input parameters for the workflow"
            }
          },
          required: ["owner", "repo", "workflow_id"]
        },
        handler: async (params: any) => {
          try {
            await this.createWorkflowDispatch(
              params.owner, 
              params.repo, 
              params.workflow_id, 
              params.ref || "main", 
              params.inputs
            )
            return JSON.stringify({ success: true, message: "Workflow dispatch created" })
          } catch (error: any) {
            return `Error: ${error.message}`
          }
        }
      }
    ]
  }
}