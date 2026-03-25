import {
  ClientVersionPolicy,
  ClientVersionPolicySource,
  Workspace,
  isClientVersionPolicy,
} from "@budibase/types"

export interface ResolvedClientVersionPolicy {
  policy: ClientVersionPolicy
  source: ClientVersionPolicySource
}

const DEFAULT_POLICY: ClientVersionPolicy = "pinned"

export const resolveWorkspaceClientVersionPolicy = (
  workspace: Workspace
): ResolvedClientVersionPolicy => {
  if (isClientVersionPolicy(workspace.clientVersionPolicyOverride)) {
    return {
      policy: workspace.clientVersionPolicyOverride,
      source: "workspace",
    }
  }

  return {
    policy: DEFAULT_POLICY,
    source: "default",
  }
}
