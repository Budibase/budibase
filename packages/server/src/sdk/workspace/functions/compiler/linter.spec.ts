import { lintFunctionSource } from "./linter"

describe("lintFunctionSource", () => {
  it("accepts a parenthesized async arrow entrypoint", () => {
    expect(lintFunctionSource("export default (async () => {})")).toEqual([])
  })

  it("allows calls to a locally shadowed require", () => {
    expect(
      lintFunctionSource(`
const require = (value: string) => value

export default async function () {
  return require("value")
}`)
    ).toEqual([])
  })

  it("rejects calls to the unshadowed require", () => {
    expect(
      lintFunctionSource(`
export default async function () {
  return require("module")
}`)
    ).toEqual([
      expect.objectContaining({
        code: "FUNCTION_IMPORT_NOT_ALLOWED",
      }),
    ])
  })
})
