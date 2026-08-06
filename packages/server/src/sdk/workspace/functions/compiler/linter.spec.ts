import { lintFunctionSource } from "./linter"

describe("lintFunctionSource", () => {
  it("accepts a parenthesized async arrow entrypoint", () => {
    expect(lintFunctionSource("export default (async () => {})")).toEqual([])
  })
})
