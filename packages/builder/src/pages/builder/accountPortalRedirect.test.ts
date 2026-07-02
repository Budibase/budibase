import { readFileSync } from "fs"
import { resolve } from "path"
import { describe, expect, it } from "vitest"

const readBuilderPage = (relativePath: string) =>
  readFileSync(resolve(__dirname, relativePath), "utf8")

describe("account portal redirect layout", () => {
  it("waits for auth to load before redirecting in builder layout", () => {
    const source = readBuilderPage("_layout.svelte")

    expect(source).toContain('case "accountPortalRedirect"')
    expect(source).toMatch(/\$admin\.loaded && \$auth\.loaded && !\$auth\.user/)
  })

  it("does not synchronously redirect to account portal from auth layout", () => {
    const source = readBuilderPage("auth/_layout.svelte")

    expect(source).not.toContain(
      "window.location.href = $admin.accountPortalUrl"
    )
    expect(source).toContain("$auth.loaded")
    expect(source).toContain("getDefaultPostLoginPath")
  })
})
