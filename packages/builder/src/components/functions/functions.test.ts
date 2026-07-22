import { render, screen } from "@testing-library/svelte"
import { describe, expect, it } from "vitest"
import RunnerHealthBadge from "./RunnerHealthBadge.svelte"
import FunctionDeploymentStatus from "./FunctionDeploymentStatus.svelte"
import TrustedAuthorWarning from "./TrustedAuthorWarning.svelte"
import { RunnerHealth } from "@/helpers/functionsGate"

describe("RunnerHealthBadge", () => {
  it.each([
    [RunnerHealth.Healthy, "Runner healthy"],
    [RunnerHealth.Disabled, "Runner disabled"],
    [RunnerHealth.Unhealthy, "Runner unavailable"],
    [RunnerHealth.Busy, "Runner busy"],
  ])("renders the %s state without source-code error wording", (health, label) => {
    render(RunnerHealthBadge, { props: { health } })
    expect(screen.getByText(label)).toBeInTheDocument()
    expect(screen.queryByText(/error in your (function|code)/i)).toBeNull()
  })
})

describe("FunctionDeploymentStatus", () => {
  it.each([
    [{ published: false, hasUnpublishedChanges: false }, "Not published"],
    [{ published: true, hasUnpublishedChanges: false }, "Published"],
    [{ published: true, hasUnpublishedChanges: true }, "Unpublished changes"],
  ])("renders the correct deployment label", (publishState, label) => {
    render(FunctionDeploymentStatus, { props: { publishState } })
    expect(screen.getByText(label)).toBeInTheDocument()
  })
})

describe("TrustedAuthorWarning", () => {
  it("renders the trusted-author warning", () => {
    render(TrustedAuthorWarning)
    expect(
      screen.getByText(/assumes trusted Function authors/i)
    ).toBeInTheDocument()
  })
})
