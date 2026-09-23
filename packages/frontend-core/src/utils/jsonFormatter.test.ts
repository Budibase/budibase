import { describe, expect, it } from "vitest"
import { format } from "./jsonFormatter"

describe("JSON formatter", () => {
  it("escapes markup in raw string values", () => {
    const formatted = format("<img src=x onerror=alert(window.xssproof)>")

    expect(formatted).toContain(
      "&lt;img src=x onerror=alert(window.xssproof)&gt;"
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

  it("preserves raw strings without adding JSON quotes", () => {
    expect(format("hello & goodbye")).toBe(
      '<span class="json-highlight">hello &amp; goodbye</span>'
    )
  })

  it("formats undefined binding results", () => {
    expect(format(undefined)).toBe(
      '<span class="json-highlight">undefined</span>'
    )
  })

  it("preserves indentation when formatting objects", () => {
    expect(format({ value: 42 }).replace(/<[^>]*>/g, "")).toBe(
      "{\n  &quot;value&quot;: 42\n}"
    )
  })

  it("highlights numbers with negative exponents as one token", () => {
    expect(format(1e-7)).toContain('<span class="hljs-number">1e-7</span>')
  })

  it.each([true, false, null])("highlights the literal %s", value => {
    const formatted = format(value)

    expect(formatted).toContain('class="hljs-literal"')
    expect(formatted.replace(/<[^>]*>/g, "")).toBe(String(value))
  })
})
