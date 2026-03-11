import { render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import MockActiveDirectoryInfo from "@/test/mocks/MockActiveDirectoryInfo.svelte"
import MockGroupIcon from "@/test/mocks/MockGroupIcon.svelte"

vi.mock("./GroupIcon.svelte", () => ({
  default: MockGroupIcon,
}))

vi.mock("../../_components/ActiveDirectoryInfo.svelte", () => ({
  default: MockActiveDirectoryInfo,
}))

import GroupNameTableRenderer from "./GroupNameTableRenderer.svelte"

describe("GroupNameTableRenderer", () => {
  it("shows a sync badge for scim groups", () => {
    render(GroupNameTableRenderer, {
      props: {
        value: "Synced group",
        row: {
          name: "Synced group",
          scimInfo: { isSync: true },
        },
      },
    })

    expect(screen.getByTitle("Synced group")).toBeInTheDocument()
    expect(screen.getByTestId("sync-badge")).toBeInTheDocument()
  })

  it("does not show a sync badge for non-scim groups", () => {
    render(GroupNameTableRenderer, {
      props: {
        value: "Manual group",
        row: {
          name: "Manual group",
        },
      },
    })

    expect(screen.queryByTestId("sync-badge")).not.toBeInTheDocument()
  })
})
