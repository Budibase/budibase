import { fireEvent, render, screen } from "@testing-library/svelte"
import { describe, expect, it, vi } from "vitest"
import { BackupStatus, BackupTrigger, BackupType } from "@budibase/types"
import MockActionMenu from "@/test/mocks/MockActionMenu.svelte"
import MockIcon from "@/test/mocks/MockIcon.svelte"
import MockInput from "@/test/mocks/MockInput.svelte"
import MockLayout from "@/test/mocks/MockLayout.svelte"
import MockMenuItem from "@/test/mocks/MockMenuItem.svelte"
import MockModal from "@/test/mocks/MockModal.svelte"
import MockModalContent from "@/test/mocks/MockModalContent.svelte"

vi.mock("@budibase/bbui", async importOriginal => {
  const actual = await importOriginal<typeof import("@budibase/bbui")>()
  return {
    ...actual,
    AbsTooltip: MockLayout,
    ActionMenu: MockActionMenu,
    Body: MockLayout,
    Heading: MockLayout,
    Icon: MockIcon,
    Input: MockInput,
    MenuItem: MockMenuItem,
    Modal: MockModal,
    ModalContent: MockModalContent,
  }
})

vi.mock("@/components/common/ConfirmDialog.svelte", () => ({
  default: MockLayout,
}))

vi.mock("@/stores/builder", async () => {
  const { writable } = await import("svelte/store")
  return { isOnlyUser: writable(true) }
})

vi.mock("@/stores/portal/auth", async () => {
  const { writable } = await import("svelte/store")
  return { auth: writable({ user: { firstName: "Ada" } }) }
})

import ActionsRenderer from "./ActionsRenderer.svelte"

describe("ActionsRenderer", () => {
  it("includes the entered backup name in the restore event", async () => {
    const onRestore = vi.fn()
    render(ActionsRenderer, {
      props: {
        row: {
          _id: "backup_1",
          appId: "app_1",
          status: BackupStatus.COMPLETE,
          timestamp: "2026-01-01T00:00:00.000Z",
          trigger: BackupTrigger.MANUAL,
          type: BackupType.BACKUP,
        },
      },
      events: { buttonclick: onRestore },
    })

    await fireEvent.input(screen.getByLabelText("Backup name"), {
      target: { value: "Before restore" },
    })
    await fireEvent.click(screen.getByText("Confirm Restore"))

    expect(onRestore).toHaveBeenCalledWith(
      expect.objectContaining({
        detail: {
          type: "backupRestore",
          backupId: "backup_1",
          restoreBackupName: "Before restore",
        },
      })
    )
  })
})
