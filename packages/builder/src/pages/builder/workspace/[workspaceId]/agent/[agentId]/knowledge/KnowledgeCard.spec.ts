import { cleanup, fireEvent, render } from "@testing-library/svelte"
import { afterEach, describe, expect, it, vi } from "vitest"
import KnowledgeCard from "./KnowledgeCard.svelte"
import type { SharePointConnectionTableRow } from "./renderers/types"

const createRow = (): SharePointConnectionTableRow => ({
  kind: "sharepoint_connection",
  __clickable: true,
  _id: "source-1",
  sourceId: "source-1",
  siteId: "site-1",
  filename: "Support documents",
  subtitle: "2 files",
  displayStatus: "Synced",
  syncedCount: 2,
  totalCount: 2,
  failedCount: 0,
  processingCount: 0,
  hasSynced: true,
  isSyncing: false,
  knowledgeSearchConfigured: true,
  onDelete: async () => {},
  onSync: async () => {},
})

afterEach(cleanup)

describe("KnowledgeCard", () => {
  it("does not offer to open a source when knowledge search is unavailable", async () => {
    const onClick = vi.fn()
    const { container, queryByRole } = render(KnowledgeCard, {
      row: { ...createRow(), knowledgeSearchConfigured: false },
      showActions: false,
      onClick,
    })
    const card = container.firstElementChild!
    await fireEvent.click(card)
    await fireEvent.keyDown(card, { key: "Enter" })

    expect(queryByRole("button")).toBeNull()
    expect(onClick).not.toHaveBeenCalled()
    expect(card.hasAttribute("tabindex")).toBe(false)
  })

  it.each(["Enter", " "])(
    "leaves %s on a nested action to that action",
    async key => {
      const onClick = vi.fn()
      const { getByRole } = render(KnowledgeCard, {
        row: createRow(),
        showActions: false,
        onClick,
      })
      const action = document.createElement("button")
      getByRole("button").appendChild(action)
      const event = new KeyboardEvent("keydown", {
        key,
        bubbles: true,
        cancelable: true,
      })
      await fireEvent(action, event)

      expect(event.defaultPrevented).toBe(false)
      expect(onClick).not.toHaveBeenCalled()
    }
  )

  it.each(["Enter", " "])("opens the source with %s on the card", async key => {
    const row = createRow()
    const onClick = vi.fn()
    const { getByRole } = render(KnowledgeCard, {
      row,
      showActions: false,
      onClick,
    })
    await fireEvent.keyDown(getByRole("button"), { key })

    expect(onClick).toHaveBeenCalledWith(row)
  })
})
