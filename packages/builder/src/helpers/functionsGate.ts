/**
 * Pure gating / status logic for the Functions (Alpha) builder UI (spec D6).
 *
 * All functions here are side-effect free so they can be unit tested and reused
 * by the store and components. UI gating is a usability concern only - the
 * server remains the authority and independently enforces access, so hiding
 * navigation here can never become a security bypass.
 */

export enum RunnerHealth {
  Healthy = "healthy",
  Disabled = "disabled",
  Unhealthy = "unhealthy",
  Busy = "busy",
}

export enum FunctionDeploymentState {
  NotPublished = "not_published",
  Published = "published",
  UnpublishedChanges = "unpublished_changes",
}

export const TRUSTED_AUTHOR_WARNING =
  "The local Function runner assumes trusted Function authors. It does not " +
  "contain hostile or untrusted code - only run Functions written by people " +
  "you trust."

export interface FunctionsGateInput {
  // The product FUNCTIONS feature flag on the current user.
  flagEnabled: boolean
  // Whether the builder is running against Budibase Cloud.
  cloud: boolean
  // The server's authoritative answer for whether Functions are enabled in this
  // environment. `undefined` means the environment opt-in / self-host signal is
  // absent and has not been resolved yet - in that case we stay closed and wait
  // for the server rather than guessing.
  serverEnabled?: boolean
}

/**
 * Whether Functions navigation and the Run Function action should be visible.
 * Default-closed: invisible in Cloud, invisible without the flag, and invisible
 * until the server confirms the environment is opted in.
 */
export const resolveFunctionsGate = (input: FunctionsGateInput): boolean => {
  if (input.cloud) {
    return false
  }
  if (!input.flagEnabled) {
    return false
  }
  if (input.serverEnabled === undefined) {
    return false
  }
  return input.serverEnabled
}

export interface RunnerHealthDescriptor {
  label: string
  tone: "positive" | "neutral" | "warning" | "negative"
  // Deliberately always false: runner availability problems are infrastructure
  // states, never a fault in the author's Function source code.
  isSourceCodeError: false
}

const RUNNER_HEALTH: Record<RunnerHealth, RunnerHealthDescriptor> = {
  [RunnerHealth.Healthy]: {
    label: "Runner healthy",
    tone: "positive",
    isSourceCodeError: false,
  },
  [RunnerHealth.Disabled]: {
    label: "Runner disabled",
    tone: "neutral",
    isSourceCodeError: false,
  },
  [RunnerHealth.Unhealthy]: {
    label: "Runner unavailable",
    tone: "negative",
    isSourceCodeError: false,
  },
  [RunnerHealth.Busy]: {
    label: "Runner busy",
    tone: "warning",
    isSourceCodeError: false,
  },
}

export const runnerHealthDescriptor = (
  health: RunnerHealth
): RunnerHealthDescriptor => RUNNER_HEALTH[health]

export const runnerCanExecute = (health: RunnerHealth): boolean =>
  health === RunnerHealth.Healthy

export interface FunctionPublishState {
  published: boolean
  // True when the local definition differs from the published workspace version.
  hasUnpublishedChanges: boolean
}

/**
 * Derive deployment state purely from workspace comparison - independent of
 * runner readiness/health.
 */
export const resolveDeploymentState = (
  state: FunctionPublishState
): FunctionDeploymentState => {
  if (!state.published) {
    return FunctionDeploymentState.NotPublished
  }
  return state.hasUnpublishedChanges
    ? FunctionDeploymentState.UnpublishedChanges
    : FunctionDeploymentState.Published
}

export const deploymentStateLabel = (
  state: FunctionDeploymentState
): string => {
  switch (state) {
    case FunctionDeploymentState.NotPublished:
      return "Not published"
    case FunctionDeploymentState.Published:
      return "Published"
    case FunctionDeploymentState.UnpublishedChanges:
      return "Unpublished changes"
  }
}
