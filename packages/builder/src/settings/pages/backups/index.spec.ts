import { render, waitFor } from "@testing-library/svelte"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { BackupStatus, BackupTrigger, BackupType } from "@budibase/types"
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

  afterEach(() => {
    vi.useRealTimers()
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

  it("polls while a backup is pending", async () => {
    vi.useFakeTimers()
    backupsMock.searchBackups
      .mockResolvedValueOnce({
        data: [
          {
            _id: "backup_1",
            appId: "app_1",
            status: BackupStatus.PENDING,
            timestamp: "2026-01-01T00:00:00.000Z",
            trigger: BackupTrigger.MANUAL,
            type: BackupType.BACKUP,
          },
        ],
        hasNextPage: false,
        totalRows: 1,
      })
      .mockResolvedValueOnce({
        data: [],
        hasNextPage: false,
        totalRows: 0,
      })

    render(BackupsPage)

    await vi.waitFor(() =>
      expect(backupsMock.searchBackups).toHaveBeenCalledTimes(1)
    )
    await vi.advanceTimersByTimeAsync(2000)
    await vi.waitFor(() =>
      expect(backupsMock.searchBackups).toHaveBeenCalledTimes(2)
    )
  })
})
