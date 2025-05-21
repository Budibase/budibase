import { AtlassianClient } from "./atlassian"
import { GitHubClient } from "./github"

const atlassianClient = new AtlassianClient()
const githubClient = new GitHubClient()

export { githubClient, atlassianClient }