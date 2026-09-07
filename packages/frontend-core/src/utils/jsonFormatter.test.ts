import { describe, expect, it } from "vitest"
import { format } from "./jsonFormatter"

describe("JSON formatter", () => {
  it("escapes markup in raw string values", () => {
    const formatted = format("<img src=x onerror=alert(window.xssproof)>")

    expect(formatted).toContain(
      "&lt;img src&#x3D;x onerror&#x3D;alert(window.xssproof)&gt;"
    )
    expect(formatted).not.toContain("<img")
  })

  it("escapes markup in JSON string values and keys", () => {
    const formatted = format({
      "<script>": "<img src=x>",
    })

    expect(formatted).not.toContain("<script>")
    expect(formatted).not.toContain("<img")
  })
})
