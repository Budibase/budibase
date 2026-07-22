import { describe, expect, it } from "vitest"
import {
  deploymentStateLabel,
  FunctionDeploymentState,
  resolveDeploymentState,
  resolveFunctionsGate,
  runnerCanExecute,
  runnerHealthDescriptor,
  RunnerHealth,
  TRUSTED_AUTHOR_WARNING,
} from "./functionsGate"

describe("resolveFunctionsGate", () => {
  // Every combination of the three inputs, asserting default-closed behaviour.
  const cases: Array<{
    flagEnabled: boolean
    cloud: boolean
    serverEnabled?: boolean
    expected: boolean
  }> = [
    { flagEnabled: true, cloud: false, serverEnabled: true, expected: true },
    { flagEnabled: true, cloud: false, serverEnabled: false, expected: false },
    {
      flagEnabled: true,
      cloud: false,
      serverEnabled: undefined,
      expected: false,
    },
    { flagEnabled: false, cloud: false, serverEnabled: true, expected: false },
    // Cloud always wins - never available regardless of the other inputs.
    { flagEnabled: true, cloud: true, serverEnabled: true, expected: false },
    { flagEnabled: false, cloud: true, serverEnabled: false, expected: false },
  ]

  it.each(cases)(
    "flag=$flagEnabled cloud=$cloud server=$serverEnabled -> $expected",
    ({ flagEnabled, cloud, serverEnabled, expected }) => {
      expect(
        resolveFunctionsGate({ flagEnabled, cloud, serverEnabled })
      ).toBe(expected)
    }
  )
})

describe("runnerHealthDescriptor", () => {
  it.each(Object.values(RunnerHealth))(
    "never labels %s as a source-code error",
    health => {
      const descriptor = runnerHealthDescriptor(health)
      expect(descriptor.isSourceCodeError).toBe(false)
      expect(descriptor.label.length).toBeGreaterThan(0)
    }
  )

  it("maps each health state to a distinct tone/label", () => {
    expect(runnerHealthDescriptor(RunnerHealth.Healthy).tone).toBe("positive")
    expect(runnerHealthDescriptor(RunnerHealth.Disabled).tone).toBe("neutral")
    expect(runnerHealthDescriptor(RunnerHealth.Unhealthy).tone).toBe("negative")
    expect(runnerHealthDescriptor(RunnerHealth.Busy).tone).toBe("warning")
  })

  it("only allows execution when healthy", () => {
    expect(runnerCanExecute(RunnerHealth.Healthy)).toBe(true)
    expect(runnerCanExecute(RunnerHealth.Disabled)).toBe(false)
    expect(runnerCanExecute(RunnerHealth.Unhealthy)).toBe(false)
    expect(runnerCanExecute(RunnerHealth.Busy)).toBe(false)
  })
})

describe("resolveDeploymentState", () => {
  it("is Not published before first publish", () => {
    expect(
      resolveDeploymentState({ published: false, hasUnpublishedChanges: false })
    ).toBe(FunctionDeploymentState.NotPublished)
  })

  it("is Published when in sync with the workspace", () => {
    expect(
      resolveDeploymentState({ published: true, hasUnpublishedChanges: false })
    ).toBe(FunctionDeploymentState.Published)
  })

  it("is Unpublished changes when the local definition differs", () => {
    expect(
      resolveDeploymentState({ published: true, hasUnpublishedChanges: true })
    ).toBe(FunctionDeploymentState.UnpublishedChanges)
  })

  it("is independent of runner readiness (same result whatever the health)", () => {
    // Deployment state only depends on publish/comparison, not runner health.
    const state = { published: true, hasUnpublishedChanges: true }
    expect(resolveDeploymentState(state)).toBe(
      FunctionDeploymentState.UnpublishedChanges
    )
  })

  it("labels each deployment state for display", () => {
    expect(deploymentStateLabel(FunctionDeploymentState.NotPublished)).toBe(
      "Not published"
    )
    expect(deploymentStateLabel(FunctionDeploymentState.Published)).toBe(
      "Published"
    )
    expect(
      deploymentStateLabel(FunctionDeploymentState.UnpublishedChanges)
    ).toBe("Unpublished changes")
  })
})

describe("trusted-author warning", () => {
  it("states the trusted-author assumption and does not claim hostile containment", () => {
    expect(TRUSTED_AUTHOR_WARNING).toMatch(/trusted Function authors/i)
    expect(TRUSTED_AUTHOR_WARNING).not.toMatch(/hostile|multi-tenant/i)
  })
})
