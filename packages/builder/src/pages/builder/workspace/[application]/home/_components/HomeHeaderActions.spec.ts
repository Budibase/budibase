import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockButton from "@/test/mocks/MockButton.svelte"
import MockComponent from "@/test/mocks/MockComponent.svelte"

vi.mock("@budibase/bbui", () => ({
  Button: MockButton,
}))

vi.mock("@/components/portal/licensing/FreeTrialBanner.svelte", () => ({
  default: MockComponent,
}))

import HomeHeaderActions from "./HomeHeaderActions.svelte"

describe("HomeHeaderActions", () => {
  it("hides commercial actions for enterprise plans", () => {
    render(HomeHeaderActions, {
      props: {
        projectsEnabled: true,
        isEnterprisePlan: true,
      },
    })

    expect(screen.queryByText("Upgrade plan")).not.toBeInTheDocument()
    expect(screen.queryByText("Contact sales")).not.toBeInTheDocument()
  })

  it("keeps commercial actions available for non-enterprise plans", async () => {
    const onUpgradePlan = vi.fn()
    const onContactSales = vi.fn()

    render(HomeHeaderActions, {
      props: {
        projectsEnabled: true,
        onUpgradePlan,
        onContactSales,
      },
    })

    await fireEvent.click(screen.getByText("Upgrade plan"))
    await fireEvent.click(screen.getByText("Contact sales"))

    expect(onUpgradePlan).toHaveBeenCalledOnce()
    expect(onContactSales).toHaveBeenCalledOnce()
  })

  it("preserves the trial banner when projects are disabled", () => {
    render(HomeHeaderActions, {
      props: {
        showTrialBanner: true,
      },
    })

    expect(screen.getByTestId("mock-component")).toBeInTheDocument()
    expect(screen.queryByText("Upgrade plan")).not.toBeInTheDocument()
    expect(screen.getByText("Contact sales")).toBeInTheDocument()
  })
})
