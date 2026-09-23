import { afterEach, describe, expect, it, vi } from "vitest"
import { downloadStream } from "./download.js"

describe("downloadStream", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("uses the filename from the Content-Disposition header", async () => {
    const link = {
      click: vi.fn(),
      download: "",
      href: "",
    }
    const createObjectURL = vi.fn(() => "blob:package")
    const revokeObjectURL = vi.fn()
    vi.stubGlobal("document", {
      createElement: vi.fn(() => link),
    })
    vi.stubGlobal("URL", { createObjectURL, revokeObjectURL })

    await downloadStream({
      blob: vi.fn().mockResolvedValue(new Blob(["package"])),
      headers: new Headers({
        "Content-Disposition":
          'attachment; filename="budibase-teams-support-agent-package.zip"',
      }),
    })

    expect(link.download).toBe("budibase-teams-support-agent-package.zip")
    expect(link.click).toHaveBeenCalledOnce()
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:package")
  })
})
