import { readFileSync } from "fs"
import { resolve } from "path"
import { describe, expect, it } from "vitest"

const readBuilderPage = (relativePath: string) =>
  readFileSync(resolve(__dirname, relativePath), "utf8")

const readSettingsPage = (relativePath: string) =>
  readFileSync(resolve(__dirname, "../../settings/pages", relativePath), "utf8")

describe("builder root init groups guard", () => {
  it("only loads groups during root init for builder users", () => {
    const source = readBuilderPage("_layout.svelte")

    expect(source).toContain("sdk.users.hasBuilderPermissions($auth.user)")
    expect(source).toMatch(
      /\.\.\.\(sdk\.users\.hasBuilderPermissions\(\$auth\.user\)\s*\?\s*\[groups\.init\(\)\]\s*:\s*\[\]\)/
    )
    expect(source).not.toMatch(/organisation\.init\(\),\s*groups\.init\(\)/)
  })

  it("keeps groups init on people settings pages for builder access", () => {
    expect(readSettingsPage("people/groups/index.svelte")).toContain(
      "groups.init()"
    )
    expect(readSettingsPage("people/groups/group.svelte")).toContain(
      "groups.init()"
    )
    expect(readSettingsPage("people/users/index.svelte")).toContain(
      "groups.init()"
    )
  })
})
