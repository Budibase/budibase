import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockActiveDirectoryInfo from "@/test/mocks/MockActiveDirectoryInfo.svelte"

vi.mock("../../_components/ActiveDirectoryInfo.svelte", () => ({
  default: MockActiveDirectoryInfo,
}))

import EmailTableRenderer from "./EmailTableRenderer.svelte"

describe("EmailTableRenderer", () => {
  it("shows a sync badge for scim users", () => {
    render(EmailTableRenderer, {
      props: {
        value: "scim@example.com",
        row: { scimInfo: { isSync: true } },
      },
    })

    expect(screen.getByText("scim@example.com")).toBeInTheDocument()
    expect(screen.getByTestId("sync-badge")).toBeInTheDocument()
  })

  it("does not show a sync badge for non-scim users", () => {
    render(EmailTableRenderer, {
      props: {
        value: "manual@example.com",
        row: {},
      },
    })

    expect(screen.queryByTestId("sync-badge")).not.toBeInTheDocument()
  })
})
