import { describe, expect, it } from "vitest"
import { getDefaultWorkspace } from "./defaultWorkspace"

interface TestWorkspace {
  id: string
  devId: string
  editable: boolean
  favourite: boolean
}

const workspace = (
  id: string,
  { editable = true, favourite = false } = {}
): TestWorkspace => ({
  id,
  devId: `app_dev_${id}`,
  editable,
  favourite,
})

describe("getDefaultWorkspace", () => {
  it("prefers the last visited editable workspace", () => {
    const workspaces = [
      workspace("alpha", { favourite: true }),
      workspace("bravo"),
    ]

    expect(getDefaultWorkspace(workspaces, "app_dev_bravo")?.id).toBe("bravo")
  })

  it("ignores the last visited workspace when it is not editable", () => {
    const workspaces = [
      workspace("alpha", { editable: false }),
      workspace("bravo", { favourite: true }),
    ]

    expect(getDefaultWorkspace(workspaces, "app_dev_alpha")?.id).toBe("bravo")
  })

  it("prefers an editable favourite over an earlier non-favourite", () => {
    const workspaces = [
      workspace("alpha"),
      workspace("bravo", { favourite: true }),
    ]

    expect(getDefaultWorkspace(workspaces)?.id).toBe("bravo")
  })

  it("uses the first editable favourite in the existing order", () => {
    const workspaces = [
      workspace("bravo", { favourite: true }),
      workspace("alpha", { favourite: true }),
    ]

    expect(getDefaultWorkspace(workspaces)?.id).toBe("bravo")
  })

  it("ignores favourites that are not editable", () => {
    const workspaces = [
      workspace("alpha", { editable: false, favourite: true }),
      workspace("bravo"),
    ]

    expect(getDefaultWorkspace(workspaces)?.id).toBe("bravo")
  })

  it("falls back to the first editable workspace", () => {
    const workspaces = [
      workspace("alpha", { editable: false }),
      workspace("bravo"),
      workspace("charlie"),
    ]

    expect(getDefaultWorkspace(workspaces)?.id).toBe("bravo")
  })

  it("returns undefined when there are no editable workspaces", () => {
    const workspaces = [workspace("alpha", { editable: false })]

    expect(getDefaultWorkspace(workspaces)).toBeUndefined()
  })
})
