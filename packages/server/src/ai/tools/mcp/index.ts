import { Tool } from "@budibase/types"
import { AtlassianClient } from "./atlassian"
// import { GitHubClient } from "./github"

// Create client instances
const atlassianClient = new AtlassianClient()

// Export the client for direct access
export { atlassianClient }