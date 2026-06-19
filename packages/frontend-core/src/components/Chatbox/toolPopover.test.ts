import { describe, expect, it } from "vitest"
import { getNextActiveToolPopover, isToolPopoverOpen } from "./toolPopover"

describe("tool-call popover active state", () => {
  it("opens tool A when no popover is open", () => {
    const active = getNextActiveToolPopover(null, "A")
    expect(active).toBe("A")
    expect(isToolPopoverOpen(active, "A")).toBe(true)
  })

  it("closes A automatically when B is opened", () => {
    let active = getNextActiveToolPopover(null, "A")
    active = getNextActiveToolPopover(active, "B")
    expect(active).toBe("B")
    expect(isToolPopoverOpen(active, "A")).toBe(false)
    expect(isToolPopoverOpen(active, "B")).toBe(true)
  })

  it("leaves no popover open when A is toggled closed", () => {
    let active = getNextActiveToolPopover(null, "A")
    active = getNextActiveToolPopover(active, "A")
    expect(active).toBeNull()
    expect(isToolPopoverOpen(active, "A")).toBe(false)
  })

  it("keeps only the last opened popover open across A, B and C", () => {
    let active: string | null = null
    for (const id of ["A", "B", "C"]) {
      active = getNextActiveToolPopover(active, id)
    }
    expect(active).toBe("C")
    expect(isToolPopoverOpen(active, "A")).toBe(false)
    expect(isToolPopoverOpen(active, "B")).toBe(false)
    expect(isToolPopoverOpen(active, "C")).toBe(true)
  })

  it("renders content only for the active popover", () => {
    const active = getNextActiveToolPopover(null, "A")
    expect(isToolPopoverOpen(active, "A")).toBe(true)
    expect(isToolPopoverOpen(active, "B")).toBe(false)
  })
})
