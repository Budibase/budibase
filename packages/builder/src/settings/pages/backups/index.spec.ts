import { render, waitFor } from "@testing-library/svelte"
import { beforeEach, describe, expect, it, vi } from "vitest"
import MockLayout from "@/test/mocks/MockLayout.svelte"

const { backupsMock } = vi.hoisted(() => ({
  backupsMock: {
    searchBackups: vi.fn(),
    createManualBackup: vi.fn(),
    deleteBackup: vi.fn(),
    deleteBackups: vi.fn(),
    restoreBackup: vi.fn(),
  },
}))

vi.mock("@budibase/bbui", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/bbui")>()
  return {
    ...actual,
    Body: MockLayout,
    Button: MockLayout,
    Divider: MockLayout,
    Heading: MockLayout,
    Layout: MockLayout,
    Pagination: MockLayout,
    Select: MockLayout,
    Table: MockLayout,
    notifications: {
      error: vi.fn(),
      success: vi.fn(),
      warning: vi.fn(),
    },
  }
})

vi.mock("@/stores/portal/backups", () => ({ backups: backupsMock }))

vi.mock("@/stores/portal/licensing", async () => {
  const { writable } = await import("svelte/store")
  return {
    licensing: {
      ...writable({ backupsEnabled: true }),
      goToUpgradePage: vi.fn(),
    },
  }
})

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return { workspaceStore: writable({ appId: "app_1" }) }
})

vi.mock("@/components/common/DateRangePicker.svelte", () => ({
  default: MockLayout,
}))

vi.mock("@/components/common/ConfirmDialog.svelte", () => ({
  default: MockLayout,
}))

vi.mock("@/pages/builder/_components/LockedFeature.svelte", () => ({
  default: MockLayout,
}))

vi.mock("./_components/ActionsRenderer.svelte", () => ({
  default: MockLayout,
}))
vi.mock("./_components/StatusRenderer.svelte", () => ({
  default: MockLayout,
}))
vi.mock("./_components/TimeAgoRenderer.svelte", () => ({
  default: MockLayout,
}))
vi.mock("./_components/TypeRenderer.svelte", () => ({
  default: MockLayout,
}))
vi.mock("./_components/UserRenderer.svelte", () => ({
  default: MockLayout,
}))
vi.mock("./_components/WorkspaceSizeRenderer.svelte", () => ({
  default: MockLayout,
}))

import BackupsPage from "./index.svelte"

describe("backups page", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    backupsMock.searchBackups.mockResolvedValue({
      data: [],
      hasNextPage: false,
      totalRows: 0,
    })
  })

  it("fetches the initial page once", async () => {
    render(BackupsPage)

    await waitFor(() =>
      expect(backupsMock.searchBackups).toHaveBeenCalledWith("app_1", {
        page: undefined,
      })
    )
    await waitFor(() =>
      expect(backupsMock.searchBackups).toHaveBeenCalledTimes(1)
    )
  })
})
